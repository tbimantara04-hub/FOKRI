import { getSupabaseClient, isSupabaseConfigured, getSupabaseConfigDiagnostic } from '../lib/supabase.js';
import { ROLES } from '../auth/authModel.js';
import { isAdminRole, normalizeRole, sanitizePublicRegistrationPayload } from './roleService.js';
import { clearPasswordRecoveryContext, hasPasswordRecoveryContext } from './passwordRecoveryContext.js';

const AUTH_TIMEOUT_MS = 15_000;
const PASSWORD_RECOVERY_REDIRECT_PATH = '/reset-password';
const MIN_PASSWORD_LENGTH = 8;

// Wraps a promise with a timeout. Rejects with a structured error if exceeded.
const withTimeout = (promise, ms) => {
  const timer = new Promise((_, reject) =>
    setTimeout(
      () => reject({ __timeout: true }),
      ms
    )
  );
  return Promise.race([promise, timer]);
};

export const mapSupabaseRoleToAppRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'super_admin') return ROLES.SUPER_ADMIN;
  if (normalizedRole === 'admin') return ROLES.COMPETITION_ADMIN;
  if (normalizedRole === 'committee') return ROLES.VERIFIER;
  return ROLES.PARTICIPANT;
};

export const signInWithSupabase = async ({ email, password, adminOnly = false }) => {
  // 1. Validate Supabase configuration
  if (!isSupabaseConfigured()) {
    console.warn('[Auth] Supabase not configured:', getSupabaseConfigDiagnostic());
    return {
      success: false,
      message: 'Layanan autentikasi belum tersedia.',
      code: 'AUTH_NOT_CONFIGURED',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    console.warn('[Auth] Supabase client unavailable despite config passing.');
    return {
      success: false,
      message: 'Layanan autentikasi belum tersedia.',
      code: 'AUTH_CLIENT_UNAVAILABLE',
    };
  }

  // 2. Attempt signInWithPassword with timeout
  let authData;
  try {
    const result = await withTimeout(
      client.auth.signInWithPassword({ email, password }),
      AUTH_TIMEOUT_MS
    );
    authData = result;
  } catch (err) {
    if (err && err.__timeout) {
      return {
        success: false,
        message: 'Server autentikasi tidak merespons. Silakan coba lagi.',
        code: 'AUTH_TIMEOUT',
      };
    }
    console.error('[Auth] Unexpected error during signInWithPassword:', err?.message ?? 'unknown');
    return {
      success: false,
      message: 'Terjadi kesalahan saat menghubungkan ke server autentikasi.',
      code: 'AUTH_UNEXPECTED',
    };
  }

  const { data, error } = authData;

  // 3. Handle auth failure
  if (error || !data?.user?.id) {
    const isCredentialError =
      error?.status === 400 ||
      /invalid login|invalid credentials|email not confirmed/i.test(error?.message ?? '');
    console.warn('[Auth] signInWithPassword failed — code:', error?.code ?? 'unknown');
    return {
      success: false,
      message: isCredentialError
        ? 'Email atau password salah.'
        : 'Terjadi kesalahan saat autentikasi. Silakan coba lagi.',
      code: isCredentialError ? 'AUTH_INVALID_CREDENTIALS' : 'AUTH_PROVIDER_ERROR',
    };
  }

  const userId = data.user.id;
  const userEmail = data.user.email;

  // 4. Fetch profile by authenticated user ID (database is the source of truth)
  let profile;
  try {
    const { data: profileData, error: profileError } = await client
      .from('profiles')
      .select('id, name, email, phone, institution, role, status, email_verified_at')
      .eq('id', userId)
      .single();

    // Safe debugging log (no credentials/tokens logged)
    console.info('[Auth Debug]', {
      dataUserExists: Boolean(data?.user),
      userId,
      userEmail,
      profileExists: Boolean(profileData),
      profileErrorCode: profileError?.code ?? null,
      profileErrorMessage: profileError?.message ?? null,
      profileRole: profileData?.role ?? null,
      profileStatus: profileData?.status ?? null,
    });

    if (profileError) {
      const isNotFound = profileError.code === 'PGRST116' || /no rows/i.test(profileError.message ?? '');
      console.warn('[Auth] Profile query failed — code:', profileError.code ?? 'unknown');
      return {
        success: false,
        message: isNotFound
          ? 'Profil akun tidak ditemukan.'
          : 'Profil akun tidak dapat diakses.',
        code: isNotFound ? 'AUTH_PROFILE_NOT_FOUND' : 'AUTH_PROFILE_QUERY_ERROR',
      };
    }

    if (!profileData) {
      return {
        success: false,
        message: 'Profil akun tidak ditemukan.',
        code: 'AUTH_PROFILE_NOT_FOUND',
      };
    }

    profile = profileData;
  } catch (err) {
    console.error('[Auth] Unexpected error fetching profile:', err?.message ?? 'unknown');
    return {
      success: false,
      message: 'Profil akun tidak dapat diakses.',
      code: 'AUTH_PROFILE_QUERY_ERROR',
    };
  }

  // 5. Normalize role from database (source of truth — never from form/localStorage/URL)
  const databaseRole = normalizeRole(profile.role);

  // 6. Admin-only: reject non-admin roles
  if (adminOnly && !isAdminRole(databaseRole)) {
    console.warn('[Auth] Role rejection for admin login — db role:', databaseRole);
    return {
      success: false,
      message: 'Akun belum memiliki akses admin.',
      code: 'AUTH_ROLE_REJECTED',
    };
  }

  // 7. Require active status for all logins
  if (profile.status !== 'active') {
    console.warn('[Auth] Inactive account attempted login — status:', profile.status);
    return {
      success: false,
      message: adminOnly ? 'Akun admin tidak aktif.' : 'Akun tidak aktif.',
      code: 'AUTH_ACCOUNT_INACTIVE',
    };
  }

  // 8. Map to application role
  const role = mapSupabaseRoleToAppRole(databaseRole);

  // 9. Return safe application user — no raw tokens, no secrets
  return {
    success: true,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone ?? null,
      institution: profile.institution ?? null,
      role,
      status: profile.status,
      verified: Boolean(profile.email_verified_at),
      profileComplete: true,
    },
  };
};

export const signUpParticipant = async (payload) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase belum dikonfigurasi. Sign up publik hanya tersedia setelah koneksi backend aktif.',
      code: 'AUTH_NOT_CONFIGURED',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Layanan autentikasi belum tersedia.',
      code: 'AUTH_CLIENT_UNAVAILABLE',
    };
  }

  const sanitized = sanitizePublicRegistrationPayload(payload);
  if (!sanitized.name || !sanitized.email || !sanitized.password) {
    return {
      success: false,
      message: 'Nama, email, dan password wajib diisi.',
      code: 'AUTH_MISSING_FIELDS',
    };
  }

  if (sanitized.password.length < 8) {
    return {
      success: false,
      message: 'Password minimal terdiri dari 8 karakter.',
      code: 'AUTH_WEAK_PASSWORD',
    };
  }

  let data, error;
  try {
    const result = await client.auth.signUp({
      email: sanitized.email,
      password: sanitized.password,
      options: {
        data: {
          full_name: sanitized.name,
          phone: sanitized.phone,
          institution: sanitized.institution,
          role: 'participant',
        },
      },
    });
    data = result.data;
    error = result.error;
  } catch (unexpected) {
    console.error('[Auth] signUpParticipant unexpected exception:', unexpected?.message ?? 'unknown');
    return {
      success: false,
      message: 'Terjadi kesalahan saat menghubungkan ke server pendaftaran. Silakan coba lagi.',
      code: 'AUTH_UNEXPECTED',
    };
  }

  if (error) {
    console.warn('[Auth] signUpParticipant error — code:', error.code ?? 'none', '| status:', error.status ?? 'none');

    // Rate limit — Supabase built-in email provider has a low send cap
    const isRateLimit =
      error.status === 429 ||
      error.code === 'over_email_send_rate_limit' ||
      /rate.?limit|too.?many.?request/i.test(error.message ?? '');

    if (isRateLimit) {
      return {
        success: false,
        message: 'Email verifikasi sedang dibatasi karena terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.',
        code: 'AUTH_EMAIL_RATE_LIMITED',
      };
    }

    // Duplicate email
    const isAlreadyRegistered =
      error.code === 'user_already_exists' ||
      /already registered|already exists|unique constraint/i.test(error.message ?? '');

    if (isAlreadyRegistered) {
      return {
        success: false,
        message: 'Email tersebut sudah terdaftar.',
        code: 'AUTH_EMAIL_EXISTS',
      };
    }

    // Supabase returns status 400 with specific text for "already registered" in some versions
    if (error.status === 400 && /email/i.test(error.message ?? '')) {
      return {
        success: false,
        message: 'Email tersebut sudah terdaftar atau tidak valid.',
        code: 'AUTH_EMAIL_EXISTS',
      };
    }

    // Generic signup failure — NEVER expose raw Supabase message to the user
    return {
      success: false,
      message: 'Akun gagal dibuat. Silakan coba lagi.',
      code: 'AUTH_SIGNUP_FAILED',
    };
  }

  const userId = data?.user?.id;
  if (!userId) {
    return {
      success: false,
      message: 'Gagal menyiapkan akun peserta. Silakan coba lagi.',
      code: 'AUTH_SIGNUP_FAILED',
    };
  }

  // NOTE: Database trigger public.handle_new_user() creates public.profiles automatically.
  // Client-side profiles.upsert is intentionally omitted — database trigger is sole source of truth.

  const requiresEmailConfirmation = !data.session;

  return {
    success: true,
    user: {
      id: userId,
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone ?? null,
      institution: sanitized.institution ?? null,
      role: 'participant',
    },
    requiresEmailConfirmation,
    message: requiresEmailConfirmation
      ? 'Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi sebelum login.'
      : 'Akun berhasil dibuat. Silakan masuk.',
  };
};

export const buildPasswordRecoveryRedirectUrl = (origin) => {
  try {
    const appOrigin = new URL(origin);
    if (!['http:', 'https:'].includes(appOrigin.protocol) || appOrigin.username || appOrigin.password) {
      return null;
    }
    return new URL(PASSWORD_RECOVERY_REDIRECT_PATH, appOrigin.origin).toString();
  } catch {
    return null;
  }
};

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

export const requestPasswordReset = async (email) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Pemulihan password belum tersedia karena Supabase belum dikonfigurasi.',
      code: 'AUTH_NOT_CONFIGURED',
    };
  }

  const normalizedEmail = String(email || '').trim();
  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      message: 'Masukkan alamat email yang valid.',
      code: 'AUTH_INVALID_EMAIL',
    };
  }

  const origin = (typeof window !== 'undefined' ? window.location?.origin : '') || import.meta.env?.VITE_SITE_URL || import.meta.env?.VITE_APP_URL || '';
  const redirectTo = buildPasswordRecoveryRedirectUrl(origin);
  if (!redirectTo) {
    return {
      success: false,
      message: 'Alamat aplikasi tidak valid sehingga tautan reset tidak dapat dibuat.',
      code: 'AUTH_INVALID_REDIRECT',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Layanan autentikasi belum tersedia.',
      code: 'AUTH_CLIENT_UNAVAILABLE',
    };
  }

  try {
    const { error } = await client.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
    if (error) {
      console.warn('[Auth] Password reset request failed — code:', error.code ?? 'unknown');

      const isRateLimit =
        error.status === 429 ||
        error.code === 'over_email_send_rate_limit' ||
        /rate.?limit|too.?many.?request/i.test(error.message ?? '');

      if (isRateLimit) {
        return {
          success: false,
          message: 'Permintaan reset password sedang dibatasi karena terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.',
          code: 'AUTH_RATE_LIMITED',
        };
      }

      return {
        success: false,
        message: 'Permintaan reset belum dapat diproses. Periksa koneksi internet dan coba lagi.',
        code: 'AUTH_PASSWORD_RESET_REQUEST_FAILED',
      };
    }
  } catch (error) {
    console.warn('[Auth] Password reset request failed:', error?.name ?? 'unknown');
    return {
      success: false,
      message: 'Permintaan reset belum dapat diproses. Periksa koneksi internet dan coba lagi.',
      code: 'AUTH_PASSWORD_RESET_NETWORK_ERROR',
    };
  }

  return {
    success: true,
    message: 'Jika email terdaftar, tautan reset password akan dikirim. Silakan periksa inbox atau folder spam.',
  };
};

export const verifyPasswordRecoveryContext = async () => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      code: 'AUTH_NOT_CONFIGURED',
      message: 'Layanan autentikasi belum tersedia.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      code: 'AUTH_CLIENT_UNAVAILABLE',
      message: 'Layanan autentikasi belum tersedia.',
    };
  }

  let recoveryUserId;
  try {
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      return {
        success: false,
        code: 'AUTH_RECOVERY_SESSION_INVALID',
        message: 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan reset baru untuk melanjutkan.',
      };
    }
    recoveryUserId = data.user.id;
  } catch (error) {
    console.warn('[Auth] Could not verify password recovery session:', error?.name ?? 'unknown');
    return {
      success: false,
      code: 'AUTH_RECOVERY_SESSION_UNAVAILABLE',
      message: 'Sesi pemulihan tidak dapat diverifikasi. Periksa koneksi internet atau minta tautan baru.',
    };
  }

  if (!hasPasswordRecoveryContext(recoveryUserId)) {
    return {
      success: false,
      code: 'AUTH_RECOVERY_CONTEXT_MISSING',
      message: 'Tidak ditemukan sesi pemulihan password. Minta tautan reset baru untuk melanjutkan.',
    };
  }

  return { success: true };
};

export const updateRecoveredPassword = async (password) => {
  if (String(password || '').length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      code: 'AUTH_WEAK_PASSWORD',
      message: `Password minimal terdiri dari ${MIN_PASSWORD_LENGTH} karakter.`,
    };
  }

  const recoveryContext = await verifyPasswordRecoveryContext();
  if (!recoveryContext.success) return recoveryContext;

  const client = getSupabaseClient();
  try {
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      const isExpired = error.status === 401 || /session|token|expired|invalid/i.test(error.code ?? '');
      return {
        success: false,
        code: isExpired ? 'AUTH_RECOVERY_SESSION_INVALID' : 'AUTH_PASSWORD_UPDATE_FAILED',
        message: isExpired
          ? 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan reset baru untuk melanjutkan.'
          : 'Password belum dapat diperbarui. Periksa persyaratan password dan coba lagi.',
      };
    }
  } catch (error) {
    console.warn('[Auth] Password update failed:', error?.name ?? 'unknown');
    return {
      success: false,
      code: 'AUTH_PASSWORD_UPDATE_NETWORK_ERROR',
      message: 'Password belum dapat diperbarui karena gangguan koneksi. Silakan coba lagi.',
    };
  }

  clearPasswordRecoveryContext();
  try {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) {
      console.warn('[Auth] Password changed but recovery session cleanup failed — code:', error.code ?? 'unknown');
      return { success: true, sessionCleared: false };
    }
  } catch (error) {
    console.warn('[Auth] Password changed but recovery session cleanup failed:', error?.name ?? 'unknown');
    return { success: true, sessionCleared: false };
  }

  return { success: true, sessionCleared: true };
};

export const signOutFromSupabase = async () => {
  if (!isSupabaseConfigured()) return { success: true };

  const client = getSupabaseClient();
  if (!client) return { success: true };

  const { error } = await client.auth.signOut();
  if (error) {
    return { success: false, message: error.message || 'Logout gagal.' };
  }

  return { success: true };
};
