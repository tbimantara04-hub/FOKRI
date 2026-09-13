import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
const MAX_BODY_BYTES = 8192;
const ALLOWED_PROFILE_STATUSES = new Set(['active', 'inactive', 'pending', 'suspended']);

const json = (res, status, body) => {
  res.status(status).json(body);
};

const isEnabled = (value) => String(value || '').toLowerCase() === 'true';

const tokensMatch = (provided, expected) => {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(String(provided));
  const expectedBuffer = Buffer.from(String(expected));
  return providedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

export const validateBootstrapInput = ({ email, password }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { error: 'A valid administrator email is required.' };
  }

  if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  if (normalizedPassword.length > MAX_PASSWORD_LENGTH) {
    return { error: `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.` };
  }

  return { email: normalizedEmail, password: normalizedPassword };
};

const isJsonContentType = (value) => typeof value === 'string'
  && /^application\/json(?:;\s*charset=utf-8)?$/i.test(value.trim());

const getContentLength = (req) => {
  const value = req.headers?.['content-length'] ?? req.headers?.['Content-Length'];
  if (value === undefined) return null;
  const length = Number(value);
  return Number.isSafeInteger(length) && length >= 0 ? length : -1;
};

const parseJsonBody = (req) => {
  const contentLength = getContentLength(req);
  if (contentLength === -1 || contentLength > MAX_BODY_BYTES) {
    return { error: 'Request body is too large.' };
  }

  let body = req.body;
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    const raw = body.toString();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return { error: 'Request body is too large.' };
    try {
      body = JSON.parse(raw);
    } catch {
      return { error: 'Malformed JSON body.' };
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object.' };
  }

  try {
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
      return { error: 'Request body is too large.' };
    }
  } catch {
    return { error: 'Malformed JSON body.' };
  }

  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'email' && key !== 'password')) {
    return { error: 'Request body contains unsupported fields.' };
  }

  return { body };
};

const defaultCreateAdminClient = (env) => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
};

const acquireBootstrapLock = async (admin) => {
  const { data, error } = await admin
    .from('super_admin_bootstrap_lock')
    .update({ status: 'claimed', claimed_at: new Date().toISOString() })
    .eq('id', true)
    .eq('status', 'available')
    .select('status')
    .maybeSingle();

  return { acquired: Boolean(data && data.status === 'claimed'), error };
};

const releaseBootstrapLock = async (admin) => {
  await admin.from('super_admin_bootstrap_lock')
    .update({ status: 'available', claimed_at: null })
    .eq('id', true)
    .eq('status', 'claimed');
};

const consumeBootstrapLock = async (admin) => {
  const { data, error } = await admin.from('super_admin_bootstrap_lock')
    .update({ status: 'consumed', consumed_at: new Date().toISOString() })
    .eq('id', true)
    .eq('status', 'claimed')
    .select('status')
    .maybeSingle();
  return { consumed: Boolean(data && data.status === 'consumed'), error };
};

export const createSuperAdminHandler = ({
  env = process.env,
  createAdminClient = defaultCreateAdminClient
} = {}) => async (req, res) => {
  let admin;
  let userId;
  let lockClaimed = false;
  let releaseLock = true;
  let auditCommitted = false;
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return json(res, 405, { error: 'Method not allowed.' });
    }

    if (!isJsonContentType(req.headers?.['content-type'] ?? req.headers?.['Content-Type'])) {
      return json(res, 415, { error: 'Content-Type must be application/json.' });
    }

    if (!isEnabled(env.SUPER_ADMIN_BOOTSTRAP_ENABLED)) return json(res, 404, { error: 'Not found.' });
    if (!tokensMatch(req.headers?.['x-super-admin-bootstrap-token'], env.SUPER_ADMIN_BOOTSTRAP_TOKEN)) {
      return json(res, 404, { error: 'Not found.' });
    }

    const parsed = parseJsonBody(req);
    if (parsed.error) return json(res, 400, { error: parsed.error });
    const input = validateBootstrapInput(parsed.body);
    if (input.error) return json(res, 400, { error: input.error });

    if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
      return json(res, 503, { error: 'Server bootstrap is not configured.' });
    }

    admin = createAdminClient(env);
    if (!admin) return json(res, 503, { error: 'Server bootstrap is not configured.' });

    const lock = await acquireBootstrapLock(admin);
    if (lock.error) return json(res, 503, { error: 'Unable to acquire bootstrap lock.' });
    if (!lock.acquired) return json(res, 409, { error: 'Bootstrap is already claimed or consumed.' });
    lockClaimed = true;

    const { data: existingSuperAdmin, error: existingAdminError } = await admin
      .from('profiles').select('id').eq('role', 'super_admin').limit(1).maybeSingle();
    if (existingAdminError) return json(res, 503, { error: 'Unable to verify bootstrap state.' });
    if (existingSuperAdmin) return json(res, 409, { error: 'A super_admin already exists. Bootstrap is closed.' });

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.email }
    });
    if (createError || !created?.user?.id) {
      const isDuplicate = createError?.code === 'email_exists'
        || /already registered|already exists|email exists/i.test(createError?.message || '');
      return json(res, isDuplicate ? 409 : 400, {
        error: isDuplicate ? 'An Auth user with this email already exists.' : 'Unable to create the Auth user.'
      });
    }

    userId = created.user.id;
    const rollbackUser = async () => {
      try {
        await admin.auth.admin.deleteUser(userId);
        return true;
      } catch {
        releaseLock = false;
        return false;
      }
    };
    const { data: profile, error: profileError } = await admin.from('profiles')
      .select('id, role, status').eq('id', userId).maybeSingle();
    if (profileError || !profile || profile.id !== userId || profile.role !== 'participant' || !ALLOWED_PROFILE_STATUSES.has(profile.status)) {
      await rollbackUser();
      return json(res, 500, { error: 'Auth user profile could not be verified safely.' });
    }

    const { data: promoted, error: promotionError } = await admin.from('profiles')
      .update({ role: 'super_admin', status: 'active' }).eq('id', userId)
      .select('id, role, status').single();
    if (promotionError || !promoted || promoted.id !== userId || promoted.role !== 'super_admin' || promoted.status !== 'active') {
      await rollbackUser();
      return json(res, 500, { error: 'The Auth user could not be promoted safely.' });
    }

    const { error: auditError } = await admin.from('audit_logs').insert({
      actor_id: null, action: 'SUPER_ADMIN_PROVISIONED', entity_type: 'profile', entity_id: userId,
      metadata: { target_user_id: userId, source: 'one_time_server_bootstrap' }
    });
    if (auditError) {
      await admin.from('profiles').update({ role: 'participant', status: 'active' }).eq('id', userId);
      await rollbackUser();
      return json(res, 500, { error: 'The provisioning audit record could not be written.' });
    }
    auditCommitted = true;

    const consumed = await consumeBootstrapLock(admin);
    if (consumed.error || !consumed.consumed) {
      releaseLock = false;
      lockClaimed = false;
      return json(res, 500, { error: 'Provisioning completed but bootstrap lock state requires manual recovery.' });
    }
    lockClaimed = false;
    return json(res, 201, { success: true, user_id: userId, role: 'super_admin', status: 'active', message: 'Super admin provisioned. Disable the bootstrap immediately.' });
  } catch {
    if (userId && !auditCommitted) await rollbackUser();
    if (auditCommitted) releaseLock = false;
    return json(res, 500, { error: 'Super admin provisioning failed safely.' });
  } finally {
    if (lockClaimed && releaseLock && admin) await releaseBootstrapLock(admin).catch(() => {});
  }
};

export default createSuperAdminHandler();
