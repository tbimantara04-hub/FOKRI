import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mapSupabaseRoleToAppRole, signInWithSupabase } from './authService.js';
import { ROLES } from '../auth/authModel.js';

// ─── Role mapping tests (stateless, no mocking needed) ──────────────────────

describe('mapSupabaseRoleToAppRole', () => {
  it('A: maps super_admin → SUPER_ADMIN', () => {
    expect(mapSupabaseRoleToAppRole('super_admin')).toBe(ROLES.SUPER_ADMIN);
  });

  it('maps committee → VERIFIER', () => {
    expect(mapSupabaseRoleToAppRole('committee')).toBe(ROLES.VERIFIER);
  });

  it('maps admin → COMPETITION_ADMIN', () => {
    expect(mapSupabaseRoleToAppRole('admin')).toBe(ROLES.COMPETITION_ADMIN);
  });

  it('maps participant → PARTICIPANT', () => {
    expect(mapSupabaseRoleToAppRole('participant')).toBe(ROLES.PARTICIPANT);
  });
});

// ─── signInWithSupabase integration tests (mocked Supabase) ─────────────────

const makeProfile = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test Admin',
  email: 'admin@test.com',
  phone: null,
  institution: 'Test Org',
  role: 'super_admin',
  status: 'active',
  email_verified_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

const makeSupabaseClient = ({ authError = null, authUser = { id: 'user-123' }, profileError = null, profile = null } = {}) => ({
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: authError ? null : { user: authUser },
      error: authError,
    }),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: profile,
      error: profileError,
    }),
  })),
});

vi.mock('../lib/supabase.js', () => ({
  isSupabaseConfigured: vi.fn(() => true),
  getSupabaseConfigDiagnostic: vi.fn(() => ({ configured: true, hasUrl: true, hasPublishableKey: true })),
  getSupabaseClient: vi.fn(),
}));

import { isSupabaseConfigured, getSupabaseClient } from '../lib/supabase.js';

beforeEach(() => {
  vi.clearAllMocks();
  isSupabaseConfigured.mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('signInWithSupabase', () => {
  it('A: successful super_admin login returns SUPER_ADMIN role', async () => {
    const profile = makeProfile();
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(true);
    expect(result.user.role).toBe(ROLES.SUPER_ADMIN);
    expect(result.user.id).toBe('user-123');
    expect(result.user).not.toHaveProperty('password');
  });

  it('B: invalid password returns AUTH_INVALID_CREDENTIALS error', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials', code: 'invalid_credentials' },
      authUser: null,
    }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'wrong', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(result.message).toBe('Email atau password salah.');
  });

  it('C: missing profile returns AUTH_PROFILE_NOT_FOUND', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      profile: null,
      profileError: { code: 'PGRST116', message: 'no rows returned' },
    }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PROFILE_NOT_FOUND');
    expect(result.message).toContain('Profil admin belum tersedia');
  });

  it('D: participant trying admin login returns AUTH_ROLE_REJECTED', async () => {
    const profile = makeProfile({ role: 'participant' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'p@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_ROLE_REJECTED');
    expect(result.message).toContain('tidak memiliki akses admin');
  });

  it('E: inactive admin account returns AUTH_ACCOUNT_INACTIVE', async () => {
    const profile = makeProfile({ status: 'inactive' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_ACCOUNT_INACTIVE');
    expect(result.message).toContain('belum aktif');
  });

  it('F: Supabase not configured returns AUTH_NOT_CONFIGURED', async () => {
    isSupabaseConfigured.mockReturnValue(false);

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_NOT_CONFIGURED');
  });

  it('G: unexpected exception in signInWithPassword returns safe error', async () => {
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockRejectedValue(new Error('Network failure')),
      },
    });

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.message).not.toContain('Network failure'); // No raw error to user
    expect(result.code).toBe('AUTH_UNEXPECTED');
  });

  it('H: loading state resets after successful login (no infinite loading)', async () => {
    // signInWithSupabase itself is stateless — this verifies it resolves (not hangs)
    const profile = makeProfile();
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const resultPromise = signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });
    await expect(resultPromise).resolves.toMatchObject({ success: true });
  });

  it('I: loading state resets after failure (no infinite loading)', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials' },
      authUser: null,
    }));

    const resultPromise = signInWithSupabase({ email: 'admin@test.com', password: 'wrong', adminOnly: true });
    await expect(resultPromise).resolves.toMatchObject({ success: false });
  });

  it('J: admin login never falls back to demo account when Supabase is configured', async () => {
    // Even if Supabase returns failure, result.success must be false — no DEMO_ACCOUNTS
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials' },
      authUser: null,
    }));

    const result = await signInWithSupabase({ email: 'superadmin@fokri.games', password: 'superadmin123', adminOnly: true });

    expect(result.success).toBe(false);
    // Must NOT have a user object (would indicate demo fallback)
    expect(result.user).toBeUndefined();
  });

  it('K: successful login resolves with user data suitable for /admin/dashboard redirect', async () => {
    const profile = makeProfile();
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(true);
    // Role must be admin-level for /admin/dashboard access
    expect([ROLES.SUPER_ADMIN, ROLES.COMPETITION_ADMIN, ROLES.VERIFIER]).toContain(result.user.role);
  });
});