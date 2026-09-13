import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { isAdminRole } from './roleService.js';

export const listAdminUsers = async ({ userRole }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.', data: [] };
  }

  if (!isAdminRole(userRole)) {
    return { success: false, message: 'Forbidden', status: 403, data: [] };
  }

  const { data, error } = await client.from('profiles').select('*');
  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return { success: true, data };
};

export const listAuditLogs = async ({ userRole }) => {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured() || !client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.', data: [] };
  }

  if (!isAdminRole(userRole)) {
    return { success: false, message: 'Forbidden', status: 403, data: [] };
  }

  const { data, error } = await client.from('audit_logs').select('*').order('created_at', { ascending: false });
  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return { success: true, data };
};
