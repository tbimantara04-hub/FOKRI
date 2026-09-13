import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mapSupabaseRoleToAppRole, signInWithSupabase, signUpParticipant } from './authService.js';
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

// ─── Supabase Client Mock Helper ──────────────────────────────────────────────

const makeProfile = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test User',
  email: 'user@test.com',
  phone: '08123456789',
  institution: 'Test Org',
  role: 'super_admin',
  status: 'active',
  email_verified_at: '2026-01-01T00:00:00Z',
  ...overrides,
});

const makeSupabaseClient = ({
  authError = null,
  authUser = { id: 'user-123', email: 'user@test.com' },
  signUpError = null,
  signUpUser = { id: 'user-456', email: 'participant@test.com' },
  signUpSession = null,
  profileError = null,
  profile = null,
} = {}) => {
  const fromMock = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: profile,
      error: profileError,
    }),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  }));

  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: authError ? null : { user: authUser },
        error: authError,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: signUpError ? null : { user: signUpUser, session: signUpSession },
        error: signUpError,
      }),
    },
    from: fromMock,
    _fromMock: fromMock,
  };
};

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

// ─── signInWithSupabase Tests ────────────────────────────────────────────────

describe('signInWithSupabase', () => {
  it('1. successful super_admin login returns SUPER_ADMIN role', async () => {
    const profile = makeProfile({ role: 'super_admin' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(true);
    expect(result.user.role).toBe(ROLES.SUPER_ADMIN);
    expect(result.user.id).toBe('user-123');
    expect(result.user).not.toHaveProperty('password');
  });

  it('2. invalid password returns AUTH_INVALID_CREDENTIALS error', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials', code: 'invalid_credentials' },
      authUser: null,
    }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'wrong', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(result.message).toBe('Email atau password salah.');
  });

  it('3. Supabase profile missing returns AUTH_PROFILE_NOT_FOUND', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      profile: null,
      profileError: { code: 'PGRST116', message: 'no rows returned' },
    }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PROFILE_NOT_FOUND');
    expect(result.message).toBe('Profil akun tidak ditemukan.');
  });

  it('4. profile query error (e.g. RLS failure 42P17) returns AUTH_PROFILE_QUERY_ERROR', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      profile: null,
      profileError: { code: '42P17', message: 'infinite recursion detected in policy for relation profiles' },
    }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PROFILE_QUERY_ERROR');
    expect(result.message).toBe('Profil akun tidak dapat diakses.');
  });

  it('5. participant trying admin login returns AUTH_ROLE_REJECTED', async () => {
    const profile = makeProfile({ role: 'participant' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'p@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_ROLE_REJECTED');
    expect(result.message).toBe('Akun belum memiliki akses admin.');
  });

  it('6. inactive admin account returns AUTH_ACCOUNT_INACTIVE', async () => {
    const profile = makeProfile({ status: 'inactive' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_ACCOUNT_INACTIVE');
    expect(result.message).toBe('Akun admin tidak aktif.');
  });

  it('7. Participant login success (adminOnly = false)', async () => {
    const profile = makeProfile({ role: 'participant', status: 'active' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'participant@test.com', password: 'correct', adminOnly: false });

    expect(result.success).toBe(true);
    expect(result.user.role).toBe(ROLES.PARTICIPANT);
  });

  it('8. Participant login invalid password (adminOnly = false)', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials' },
      authUser: null,
    }));

    const result = await signInWithSupabase({ email: 'participant@test.com', password: 'wrong', adminOnly: false });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('9. Participant profile missing (adminOnly = false)', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      profile: null,
      profileError: { code: 'PGRST116', message: 'no rows returned' },
    }));

    const result = await signInWithSupabase({ email: 'participant@test.com', password: 'correct', adminOnly: false });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PROFILE_NOT_FOUND');
  });

  it('10. Participant profile query error (adminOnly = false)', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      profile: null,
      profileError: { code: '42501', message: 'permission denied' },
    }));

    const result = await signInWithSupabase({ email: 'participant@test.com', password: 'correct', adminOnly: false });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PROFILE_QUERY_ERROR');
    expect(result.message).toBe('Profil akun tidak dapat diakses.');
  });

  it('11. Participant inactive account returns AUTH_ACCOUNT_INACTIVE (adminOnly = false)', async () => {
    const profile = makeProfile({ role: 'participant', status: 'inactive' });
    getSupabaseClient.mockReturnValue(makeSupabaseClient({ profile }));

    const result = await signInWithSupabase({ email: 'participant@test.com', password: 'correct', adminOnly: false });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_ACCOUNT_INACTIVE');
    expect(result.message).toBe('Akun tidak aktif.');
  });

  it('12. Supabase not configured returns AUTH_NOT_CONFIGURED', async () => {
    isSupabaseConfigured.mockReturnValue(false);

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_NOT_CONFIGURED');
  });

  it('13. unexpected exception in signInWithPassword returns safe error', async () => {
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockRejectedValue(new Error('Network failure')),
      },
    });

    const result = await signInWithSupabase({ email: 'admin@test.com', password: 'correct', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.message).not.toContain('Network failure');
    expect(result.code).toBe('AUTH_UNEXPECTED');
  });

  it('14. admin login never falls back to demo account when Supabase is configured', async () => {
    getSupabaseClient.mockReturnValue(makeSupabaseClient({
      authError: { status: 400, message: 'Invalid login credentials' },
      authUser: null,
    }));

    const result = await signInWithSupabase({ email: 'superadmin@fokri.games', password: 'superadmin123', adminOnly: true });

    expect(result.success).toBe(false);
    expect(result.user).toBeUndefined();
  });
});

// ─── signUpParticipant Tests ─────────────────────────────────────────────────

describe('signUpParticipant', () => {
  const payload = {
    name: 'Budi Santoso',
    email: 'budi@test.com',
    phone: '08123456789',
    institution: 'Universitas Indonesia',
    password: 'password123',
  };

  it('1. Successful participant signup with email confirmation required (no session)', async () => {
    const client = makeSupabaseClient({ signUpUser: { id: 'user-789' }, signUpSession: null });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(true);
    expect(result.user.id).toBe('user-789');
    expect(result.user.role).toBe('participant');
    expect(result.requiresEmailConfirmation).toBe(true);
    expect(result.message).toContain('cek email Anda untuk verifikasi');

    // CRITICAL: Must NOT attempt client-side profiles.upsert (relies on DB trigger)
    expect(client._fromMock).not.toHaveBeenCalled();
  });

  it('2. Successful participant signup with active session (email confirmation off)', async () => {
    const client = makeSupabaseClient({ signUpUser: { id: 'user-789' }, signUpSession: { access_token: 'tok' } });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(true);
    expect(result.requiresEmailConfirmation).toBe(false);
    expect(result.message).toContain('Silakan masuk.');
  });

  it('3. Supabase signup error returns AUTH_SIGNUP_FAILED', async () => {
    const client = makeSupabaseClient({
      signUpError: { code: 'signup_disabled', message: 'Signups are disabled' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_SIGNUP_FAILED');
  });

  it('4. Duplicate email returns AUTH_EMAIL_EXISTS', async () => {
    const client = makeSupabaseClient({
      signUpError: { code: 'user_already_exists', message: 'User already registered' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_EMAIL_EXISTS');
    expect(result.message).toBe('Email tersebut sudah terdaftar.');
  });

  it('5. Missing user returned from Supabase returns AUTH_SIGNUP_FAILED', async () => {
    const client = makeSupabaseClient({ signUpUser: null });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_SIGNUP_FAILED');
  });

  it('6. Weak password returns AUTH_WEAK_PASSWORD', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant({ ...payload, password: 'short' });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_WEAK_PASSWORD');
    expect(result.message).toBe('Password minimal terdiri dari 8 karakter.');
  });

  it('7. Supabase not configured returns AUTH_NOT_CONFIGURED', async () => {
    isSupabaseConfigured.mockReturnValue(false);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_NOT_CONFIGURED');
  });
});