import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { ROLES } from '../auth/authModel.js';
import { isAdminRole, normalizeRole, sanitizePublicRegistrationPayload } from './roleService.js';

export const mapSupabaseRoleToAppRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'super_admin') return ROLES.SUPER_ADMIN;
  if (normalizedRole === 'admin') return ROLES.COMPETITION_ADMIN;
  if (normalizedRole === 'committee') return ROLES.VERIFIER;
  return ROLES.PARTICIPANT;
};

export const signInWithSupabase = async ({ email, password, adminOnly = false }) => {
  const client = getSupabaseClient();

  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi. Gunakan mode mock development untuk saat ini.' };
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: error.message || 'Email atau password salah.' };
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, message: 'Profil pengguna tidak ditemukan.' };
  }

  const databaseRole = normalizeRole(profile.role);
  if (adminOnly && !isAdminRole(databaseRole)) {
    return { success: false, message: 'Akun admin tidak ditemukan atau kredensial salah.' };
  }
  const role = mapSupabaseRoleToAppRole(databaseRole);

  return {
    success: true,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      institution: profile.institution,
      role,
      status: profile.status,
      verified: Boolean(profile.email_verified_at),
      profileComplete: true
    }
  };
};

export const signUpParticipant = async (payload) => {
  const client = getSupabaseClient();

  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi. Sign up publik hanya tersedia setelah koneksi backend aktif.' };
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
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: true };
  }

  const { error } = await client.auth.signOut();
  if (error) {
    return { success: false, message: error.message || 'Logout gagal.' };
  }

  return { success: true };
};
