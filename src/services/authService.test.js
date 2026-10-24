import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  buildPasswordRecoveryRedirectUrl,
  mapSupabaseRoleToAppRole,
  requestPasswordReset,
  signInWithSupabase,
  signUpParticipant,
  updateRecoveredPassword,
  verifyPasswordRecoveryContext,
} from './authService.js';
import { ROLES } from '../auth/authModel.js';

vi.mock('./passwordRecoveryContext.js', () => ({
  clearPasswordRecoveryContext: vi.fn(),
  hasPasswordRecoveryContext: vi.fn(() => true),
  markPasswordRecoveryContext: vi.fn(),
}));

import { clearPasswordRecoveryContext, hasPasswordRecoveryContext } from './passwordRecoveryContext.js';

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
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
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
  hasPasswordRecoveryContext.mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
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

  it('1. Successful signup — no session (email confirmation required)', async () => {
    const client = makeSupabaseClient({ signUpUser: { id: 'user-789' }, signUpSession: null });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(true);
    expect(result.user.id).toBe('user-789');
    expect(result.user.role).toBe('participant');
    expect(result.requiresEmailConfirmation).toBe(true);
    expect(result.message).toContain('cek email Anda untuk verifikasi');
    // CRITICAL: must NOT call profiles.upsert — DB trigger is sole source of truth
    expect(client._fromMock).not.toHaveBeenCalled();
  });

  it('2. Successful signup — session available (email confirmation off)', async () => {
    const client = makeSupabaseClient({
      signUpUser: { id: 'user-789' },
      signUpSession: { access_token: 'tok' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(true);
    expect(result.requiresEmailConfirmation).toBe(false);
    expect(result.message).toContain('Silakan masuk.');
    expect(client._fromMock).not.toHaveBeenCalled();
  });

  it('3. Email rate limit via HTTP 429 → AUTH_EMAIL_RATE_LIMITED (raw message must NOT leak)', async () => {
    const client = makeSupabaseClient({
      signUpError: { status: 429, message: 'email rate limit exceeded', code: 'over_email_send_rate_limit' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_EMAIL_RATE_LIMITED');
    expect(result.message).not.toContain('rate limit exceeded');
    expect(result.message).toContain('Silakan tunggu beberapa saat');
  });

  it('4. Email rate limit via code over_email_send_rate_limit → AUTH_EMAIL_RATE_LIMITED', async () => {
    const client = makeSupabaseClient({
      signUpError: { status: 400, message: 'some internal message', code: 'over_email_send_rate_limit' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_EMAIL_RATE_LIMITED');
    expect(result.message).not.toBe('some internal message');
  });

  it('5. Duplicate email via user_already_exists code → AUTH_EMAIL_EXISTS', async () => {
    const client = makeSupabaseClient({
      signUpError: { code: 'user_already_exists', message: 'User already registered', status: 422 },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_EMAIL_EXISTS');
    expect(result.message).toBe('Email tersebut sudah terdaftar.');
  });

  it('6. Duplicate email via message pattern → AUTH_EMAIL_EXISTS', async () => {
    const client = makeSupabaseClient({
      signUpError: { code: null, message: 'User already registered in system', status: 422 },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_EMAIL_EXISTS');
  });

  it('7. Generic Supabase failure — raw Supabase message must NOT reach the user', async () => {
    const client = makeSupabaseClient({
      signUpError: { code: 'signup_disabled', message: 'Signups are disabled for this project', status: 500 },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_SIGNUP_FAILED');
    expect(result.message).not.toContain('Signups are disabled for this project');
    expect(result.message).toBe('Akun gagal dibuat. Silakan coba lagi.');
  });

  it('8. Missing user returned from Supabase → AUTH_SIGNUP_FAILED', async () => {
    const client = makeSupabaseClient({ signUpUser: null });
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_SIGNUP_FAILED');
  });

  it('9. Weak password → AUTH_WEAK_PASSWORD (no Supabase call made)', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant({ ...payload, password: 'short' });

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_WEAK_PASSWORD');
    expect(result.message).toBe('Password minimal terdiri dari 8 karakter.');
    expect(client.auth.signUp).not.toHaveBeenCalled();
  });

  it('10. Supabase not configured → AUTH_NOT_CONFIGURED', async () => {
    isSupabaseConfigured.mockReturnValue(false);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_NOT_CONFIGURED');
  });

  it('11. Supabase signUp throws unexpected exception → AUTH_UNEXPECTED (no crash, no raw error)', async () => {
    const client = {
      auth: {
        signUp: vi.fn().mockRejectedValue(new Error('Network error: connection reset')),
      },
      from: vi.fn(),
      _fromMock: vi.fn(),
    };
    getSupabaseClient.mockReturnValue(client);

    const result = await signUpParticipant(payload);

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_UNEXPECTED');
    expect(result.message).not.toContain('Network error');
    expect(result.message).not.toContain('connection reset');
  });

  it('12. No profiles.upsert from client-side under any signup outcome', async () => {
    const client = makeSupabaseClient({
      signUpUser: { id: 'user-789' },
      signUpSession: { access_token: 'tok' },
    });
    getSupabaseClient.mockReturnValue(client);

    await signUpParticipant(payload);

    expect(client._fromMock).not.toHaveBeenCalled();
  });
});

describe('password recovery', () => {
  it('builds a same-origin reset URL and rejects unsafe origins', () => {
    expect(buildPasswordRecoveryRedirectUrl('http://localhost:5173')).toBe('http://localhost:5173/reset-password');
    expect(buildPasswordRecoveryRedirectUrl('javascript:alert(1)')).toBeNull();
    expect(buildPasswordRecoveryRedirectUrl('not a url')).toBeNull();
  });

  it('does not call Supabase for an invalid email', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await requestPasswordReset('invalid');

    expect(result.code).toBe('AUTH_INVALID_EMAIL');
    expect(client.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('requires Supabase configuration and shows no false success', async () => {
    isSupabaseConfigured.mockReturnValue(false);

    const result = await requestPasswordReset('user@example.com');

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_NOT_CONFIGURED');
  });

  it('uses the validated current origin and returns an enumeration-safe confirmation', async () => {
    vi.stubGlobal('window', { location: { origin: 'https://fokri.example' } });
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await requestPasswordReset(' user@example.com ');

    expect(client.auth.resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
      redirectTo: 'https://fokri.example/reset-password',
    });
    expect(result.success).toBe(true);
    expect(result.message).toContain('Jika email terdaftar');
  });

  it('does not disclose provider errors or user existence', async () => {
    vi.stubGlobal('window', { location: { origin: 'https://fokri.example' } });
    const client = makeSupabaseClient();
    client.auth.resetPasswordForEmail.mockResolvedValue({
      error: { code: 'user_not_found', message: 'No user with this email address' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await requestPasswordReset('user@example.com');

    expect(result.success).toBe(false);
    expect(result.message).not.toContain('user_not_found');
    expect(result.message).not.toContain('No user');
  });

  it('reports request network failures without claiming that an email was sent', async () => {
    vi.stubGlobal('window', { location: { origin: 'https://fokri.example' } });
    const client = makeSupabaseClient();
    client.auth.resetPasswordForEmail.mockRejectedValue(new TypeError('Failed to fetch'));
    getSupabaseClient.mockReturnValue(client);

    const result = await requestPasswordReset('user@example.com');

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PASSWORD_RESET_NETWORK_ERROR');
    expect(result.message).not.toContain('Jika email terdaftar');
  });

  it('requires both a verified Supabase user and a recovery event context', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);
    hasPasswordRecoveryContext.mockReturnValue(false);

    const result = await verifyPasswordRecoveryContext();

    expect(client.auth.getUser).toHaveBeenCalledOnce();
    expect(result.code).toBe('AUTH_RECOVERY_CONTEXT_MISSING');
  });

  it('rejects an expired or invalid recovery session', async () => {
    const client = makeSupabaseClient();
    client.auth.getUser.mockResolvedValue({ data: { user: null }, error: { status: 401 } });
    getSupabaseClient.mockReturnValue(client);

    const result = await verifyPasswordRecoveryContext();

    expect(result.code).toBe('AUTH_RECOVERY_SESSION_INVALID');
  });

  it('updates the password only with a valid recovery context and closes the local session', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await updateRecoveredPassword('a-strong-password');

    expect(client.auth.updateUser).toHaveBeenCalledWith({ password: 'a-strong-password' });
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(clearPasswordRecoveryContext).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true, sessionCleared: true });
  });

  it('rejects weak passwords before calling Supabase', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);

    const result = await updateRecoveredPassword('short');

    expect(result.code).toBe('AUTH_WEAK_PASSWORD');
    expect(client.auth.updateUser).not.toHaveBeenCalled();
  });

  it('does not update the password without recovery context', async () => {
    const client = makeSupabaseClient();
    getSupabaseClient.mockReturnValue(client);
    hasPasswordRecoveryContext.mockReturnValue(false);

    const result = await updateRecoveredPassword('a-strong-password');

    expect(result.code).toBe('AUTH_RECOVERY_CONTEXT_MISSING');
    expect(client.auth.updateUser).not.toHaveBeenCalled();
  });

  it('handles email send rate limiting gracefully', async () => {
    vi.stubGlobal('window', { location: { origin: 'https://fokri.example' } });
    const client = makeSupabaseClient();
    client.auth.resetPasswordForEmail.mockResolvedValue({
      error: { status: 429, code: 'over_email_send_rate_limit', message: 'Rate limit exceeded' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await requestPasswordReset('user@example.com');

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_RATE_LIMITED');
    expect(result.message).toContain('sedang dibatasi');
  });

  it('handles expired token during updateRecoveredPassword', async () => {
    const client = makeSupabaseClient();
    client.auth.updateUser.mockResolvedValue({
      error: { status: 401, code: 'session_expired', message: 'Token has expired' },
    });
    getSupabaseClient.mockReturnValue(client);

    const result = await updateRecoveredPassword('newValidPassword123');

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_RECOVERY_SESSION_INVALID');
  });

  it('handles network error during updateRecoveredPassword', async () => {
    const client = makeSupabaseClient();
    client.auth.updateUser.mockRejectedValue(new TypeError('Failed to fetch'));
    getSupabaseClient.mockReturnValue(client);

    const result = await updateRecoveredPassword('newValidPassword123');

    expect(result.success).toBe(false);
    expect(result.code).toBe('AUTH_PASSWORD_UPDATE_NETWORK_ERROR');
  });
});
