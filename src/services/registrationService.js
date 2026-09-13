import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { assertResourceOwnership, normalizeRole } from './roleService.js';

export const listOwnRegistrations = async ({ userId, role }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.', data: [] };
  }

  const normalizedRole = normalizeRole(role);
  if (!userId) {
    return { success: false, message: 'User tidak terautentikasi.', data: [] };
  }

  const { data, error } = normalizedRole === 'participant'
    ? await client.from('registrations').select('*').eq('user_id', userId)
    : await client.from('registrations').select('*');

  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return { success: true, data };
};

export const getRegistrationById = async ({ registrationId, userId, role }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const { data, error } = await client.from('registrations').select('*').eq('id', registrationId).single();
  if (error || !data) {
    return { success: false, message: 'Registrasi tidak ditemukan.' };
  }

  const ownerCheck = assertResourceOwnership({
    actorId: userId,
    ownerId: data.user_id,
    actorRole: role,
    allowAdmin: true
  });

  if (!ownerCheck.allowed) {
    return { success: false, message: 'Forbidden', status: 403 };
  }

  return { success: true, data };
};

export const createRegistration = async ({ userId, competitionId, details }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const { data, error } = await client.from('registrations').insert({
    user_id: userId,
    competition_id: competitionId,
    status: 'DRAFT',
    metadata: details || {}
  }).select().single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, data };
};
