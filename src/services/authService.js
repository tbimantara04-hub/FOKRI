import { getSupabaseClient, isSupabaseConfigured, getSupabaseConfigDiagnostic } from '../lib/supabase.js';
import { ROLES } from '../auth/authModel.js';
import { isAdminRole, normalizeRole, sanitizePublicRegistrationPayload } from './roleService.js';

const AUTH_TIMEOUT_MS = 15_000;

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

  // 7. Require active status for admin logins
  if (adminOnly && profile.status !== 'active') {
    console.warn('[Auth] Inactive account attempted admin login — status:', profile.status);
    return {
      success: false,
      message: 'Akun admin tidak aktif.',
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
    return { success: false, message: 'Supabase belum dikonfigurasi. Sign up publik hanya tersedia setelah koneksi backend aktif.' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Layanan autentikasi belum tersedia.' };
  }

  const sanitized = sanitizePublicRegistrationPayload(payload);
  if (!sanitized.name || !sanitized.email || !sanitized.password) {
    return { success: false, message: 'Nama, email, dan password wajib diisi.' };
  }

  const { data, error } = await client.auth.signUp({
    email: sanitized.email,
    password: sanitized.password,
    options: {
      data: {
        full_name: sanitized.name,
        phone: sanitized.phone,
        institution: sanitized.institution,
        role: 'participant'
      }
    }
  });

  if (error) {
    return { success: false, message: error.message || 'Pendaftaran gagal.' };
  }

  const userId = data?.user?.id;
  if (!userId) {
    return { success: false, message: 'Pendaftaran berhasil dibuat, tetapi profil tidak tersedia.' };
  }

  const { error: profileError } = await client.from('profiles').upsert({
    id: userId,
    name: sanitized.name,
    email: sanitized.email,
    phone: sanitized.phone,
    institution: sanitized.institution,
    role: 'participant',
    status: 'active'
  }, { onConflict: 'id' });

  if (profileError) {
    return { success: false, message: profileError.message || 'Gagal membuat profil peserta.' };
  }

  return {
    success: true,
    user: {
      id: userId,
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone,
      institution: sanitized.institution,
      role: 'participant'
    }
  };
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
