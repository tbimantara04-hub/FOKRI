import { describe, expect, it } from 'vitest';
import { createSuperAdminHandler, validateBootstrapInput } from './provision-super-admin.js';

const userId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const response = () => ({
  statusCode: 200,
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
});

const request = (body, token = 'one-time-token', headers = {}) => ({
  method: 'POST',
  body,
  headers: { 'x-super-admin-bootstrap-token': token, 'content-type': 'application/json', ...headers }
});

const fakeAdmin = ({ createError, profile, profileError, promotionError, auditError, existingSuperAdmin, existingAdminError, failLock } = {}) => {
  const deleted = [];
  const updates = [];
  let lockStatus = 'available';
  const admin = {
    deleted,
    updates,
    auth: {
      admin: {
        async createUser() {
          if (createError) return { data: null, error: createError };
          return { data: { user: { id: userId } }, error: null };
        },
        async deleteUser(id) {
          deleted.push(id);
          return { error: null };
        }
      }
    },
    from(table) {
      if (table === 'super_admin_bootstrap_lock') {
        return {
          update(values) {
            return {
              eq() { return this; },
              select() { return this; },
              async maybeSingle() {
                if (failLock) return { data: null, error: { message: 'lock failure' } };
                if (values.status === 'claimed' && lockStatus === 'available') {
                  lockStatus = 'claimed';
                  return { data: { status: 'claimed' }, error: null };
                }
                if (values.status === 'consumed' && lockStatus === 'claimed') {
                  lockStatus = 'consumed';
                  return { data: { status: 'consumed' }, error: null };
                }
                return { data: null, error: null };
              }
            };
          }
        };
      }
      if (table === 'profiles') {
        let existingQuery = false;
        return {
          select() { return this; },
          eq(field, value) {
            if (field === 'role' && value === 'super_admin') existingQuery = true;
            return this;
          },
          limit() { return this; },
          async maybeSingle() {
            return existingQuery
              ? { data: existingSuperAdmin || null, error: existingAdminError || null }
              : { data: profile || { id: userId, role: 'participant', status: 'active' }, error: profileError || null };
          },
          update(values) {
            updates.push(values);
            return {
              eq() { return this; },
              select() { return this; },
              async single() {
                return { data: { id: userId, role: 'super_admin', status: 'active' }, error: promotionError || null };
              }
            };
          }
        };
      }
      return {
        insert() {
          return Promise.resolve({ error: auditError || null });
        }
      };
    }
  };
  return admin;
};

describe('one-time super admin bootstrap', () => {
  it('rejects when disabled by default', async () => {
    const handler = createSuperAdminHandler({ env: {}, createAdminClient: () => { throw new Error('must not create client'); } });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(404);
  });

  it('rejects missing and wrong Content-Type', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token' };
    const handler = createSuperAdminHandler({ env });
    const missing = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }, 'one-time-token', { 'content-type': undefined }), missing);
    expect(missing.statusCode).toBe(415);
    const wrong = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }, 'one-time-token', { 'content-type': 'text/plain' }), wrong);
    expect(wrong.statusCode).toBe(415);
  });

  it('rejects missing or incorrect bootstrap tokens', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token' };
    const handler = createSuperAdminHandler({ env });
    for (const token of ['', 'wrong-token']) {
      const res = response();
      await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }, token), res);
      expect(res.statusCode).toBe(404);
    }
  });

  it('rejects malformed JSON, arrays, primitives, and oversized bodies', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const handler = createSuperAdminHandler({ env, createAdminClient: () => { throw new Error('must not provision'); } });
    for (const body of ['{bad', [], 'text', 7, true, { email: 'admin@example.com', password: 'long-secure-password', role: 'super_admin' }]) {
      const res = response();
      await handler(request(body), res);
      expect(res.statusCode).toBe(400);
    }
    const large = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }, 'one-time-token', { 'content-length': '9000' }), large);
    expect(large.statusCode).toBe(400);
  });

  it('rejects missing server secret configuration', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token' };
    const handler = createSuperAdminHandler({ env });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(503);
  });

  it('rejects a missing or weak input before provisioning', () => {
    expect(validateBootstrapInput({ email: 'invalid', password: 'short' }).error).toBeTruthy();
    expect(validateBootstrapInput({ email: 'admin@example.com', password: 'long-secure-password' }).email).toBe('admin@example.com');
    expect(validateBootstrapInput({ email: 'admin@example.com', password: 'x'.repeat(129) }).error).toBeTruthy();
  });

  it('provisions only the created Auth user and promotes its matching profile', async () => {
    const env = {
      SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true',
      SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SECRET_KEY: 'server-only-secret'
    };
    const admin = fakeAdmin();
    const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ success: true, user_id: userId, role: 'super_admin', status: 'active' });
    expect(admin.updates).toContainEqual({ role: 'super_admin', status: 'active' });
    expect(admin.deleted).toEqual([]);
  });

  it('blocks a second provisioning attempt after the lock is consumed', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const admin = fakeAdmin();
    const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
    const first = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), first);
    const second = response();
    await handler(request({ email: 'second@example.com', password: 'long-secure-password' }), second);
    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(409);
  });

  it('handles duplicate email without deleting another user', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const admin = fakeAdmin({ createError: { code: 'email_exists', message: 'User already registered' } });
    const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(409);
    expect(admin.deleted).toEqual([]);
  });

  it('refuses provisioning when a super_admin already exists', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const admin = fakeAdmin({ existingSuperAdmin: { id: 'existing-admin' } });
    const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(409);
    expect(admin.deleted).toEqual([]);
  });

  it('rolls back when audit logging fails', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const admin = fakeAdmin({ auditError: { message: 'audit failure' } });
    const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(500);
    expect(admin.deleted).toEqual([userId]);
  });

  it('rejects an unexpected initial profile role or status and rolls back', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    for (const profile of [{ id: userId, role: 'admin', status: 'active' }, { id: userId, role: 'participant', status: 'unknown' }]) {
      const admin = fakeAdmin({ profile });
      const handler = createSuperAdminHandler({ env, createAdminClient: () => admin });
      const res = response();
      await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
      expect(res.statusCode).toBe(500);
      expect(admin.deleted).toEqual([userId]);
    }
  });

  it('rejects when the bootstrap lock is unavailable', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const admin = fakeAdmin();
    let calls = 0;
    const handler = createSuperAdminHandler({ env, createAdminClient: () => ({ ...admin, from: (table) => {
      if (table === 'super_admin_bootstrap_lock') return { update: () => ({ eq() { return this; }, select() { return this; }, async maybeSingle() { calls += 1; return { data: null, error: null }; } }) };
      return admin.from(table);
    } }) });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(409);
    expect(calls).toBe(1);
  });

  it('contains unexpected exceptions as a safe 5xx response', async () => {
    const env = { SUPER_ADMIN_BOOTSTRAP_ENABLED: 'true', SUPER_ADMIN_BOOTSTRAP_TOKEN: 'one-time-token', SUPABASE_URL: 'url', SUPABASE_SECRET_KEY: 'secret' };
    const handler = createSuperAdminHandler({ env, createAdminClient: () => { throw new Error('secret internals'); } });
    const res = response();
    await handler(request({ email: 'admin@example.com', password: 'long-secure-password' }), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).not.toContain('secret internals');
  });
});
