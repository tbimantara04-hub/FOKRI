import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { isAdminRole, normalizeRole } from './roleService.js';
import { buildParticipantDocumentPath, isParticipantDocumentPath, PARTICIPANT_DOCUMENTS_BUCKET } from './storagePath.js';

const MAX_SIGNED_URL_SECONDS = 300;

const getAuthenticatedUser = async (client) => {
  const { data, error } = await client.auth.getUser();
  if (error || !data?.user?.id) throw new Error('User tidak terautentikasi.');
  return data.user;
};

const authorizeRegistration = async ({ client, userId, competitionId, registrationId }) => {
  const { data: registration, error: registrationError } = await client
    .from('registrations')
    .select('id, user_id, competition_id, status')
    .eq('id', registrationId)
    .eq('competition_id', competitionId)
    .maybeSingle();

  if (registrationError || !registration) {
    throw new Error('Registration is invalid or does not belong to this competition.');
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('role, status')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile || profile.status !== 'active') {
    throw new Error('User profile is not active.');
  }

  const role = normalizeRole(profile.role);
  if (registration.user_id === userId || role === 'super_admin') return { registration, role };

  if (role === 'committee') {
    const { data } = await client.from('verifier_assignments').select('id')
      .eq('user_id', userId).eq('competition_id', competitionId).maybeSingle();
    if (data) return { registration, role };
  }

  if (isAdminRole(role)) {
    const { data } = await client.from('competition_admins').select('id')
      .eq('user_id', userId).eq('competition_id', competitionId).maybeSingle();
    if (data) return { registration, role };
  }

  throw new Error('Forbidden: user is not authorized for this registration.');
};

const getStorageRequest = async ({ competitionId, registrationId, filename, path, ownerUserId }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) return { error: 'Supabase belum dikonfigurasi.' };

  try {
    const user = await getAuthenticatedUser(client);
    const canonicalPath = buildParticipantDocumentPath({
      userId: ownerUserId || user.id,
      competitionId,
      registrationId,
      filename
    });

    if (path && path !== canonicalPath) throw new Error('Arbitrary storage paths are not allowed.');

    const authorization = await authorizeRegistration({ client, userId: user.id, competitionId, registrationId });
    return { client, user, canonicalPath, authorization };
  } catch (error) {
    return { error: error.message };
  }
};

export const listPrivateDocumentBucket = async () => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const { data, error } = await client.storage.listBuckets();
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
};

export const uploadPrivateDocument = async ({ competitionId, registrationId, filename, path, file, options = {} }) => {
  if (!file) return { success: false, message: 'Dokumen wajib diisi.' };

  const request = await getStorageRequest({ competitionId, registrationId, filename, path });
  if (request.error) return { success: false, message: request.error };

  const { data, error } = await request.client.storage.from(PARTICIPANT_DOCUMENTS_BUCKET).upload(
    request.canonicalPath,
    file,
    { cacheControl: '3600', upsert: false, ...options }
  );

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data, path: request.canonicalPath };
};

export const getPrivateDocumentSignedUrl = async ({ ownerUserId, competitionId, registrationId, filename, path, expiresIn = 60 }) => {
  const request = await getStorageRequest({ ownerUserId, competitionId, registrationId, filename, path });
  if (request.error) return { success: false, message: request.error };

  const safeExpiresIn = Math.min(Math.max(Number(expiresIn) || 60, 1), MAX_SIGNED_URL_SECONDS);
  const { data, error } = await request.client.storage
    .from(PARTICIPANT_DOCUMENTS_BUCKET)
    .createSignedUrl(request.canonicalPath, safeExpiresIn);
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data, path: request.canonicalPath, expiresIn: safeExpiresIn };
};

export { isParticipantDocumentPath } from './storagePath.js';
