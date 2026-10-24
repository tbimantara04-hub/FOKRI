import { getSupabaseClient } from '../lib/supabase.js';

const STORAGE_KEY = 'fokri_password_recovery_started_at';
const RECOVERY_CONTEXT_MAX_AGE_MS = 60 * 60 * 1000;

export const markPasswordRecoveryContext = (session) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      startedAt: Date.now(),
      userId: session?.user?.id,
    }));
  } catch (error) {
    console.warn('[Auth] Could not persist password recovery context:', error?.name ?? 'unknown');
  }
};

export const clearPasswordRecoveryContext = () => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[Auth] Could not clear password recovery context:', error?.name ?? 'unknown');
  }
};

export const hasPasswordRecoveryContext = (userId) => {
  if (typeof window === 'undefined') return false;

  try {
    const hash = window.location.hash || '';
    if (hash.includes('type=recovery') && userId) {
      markPasswordRecoveryContext({ user: { id: userId } });
      return true;
    }

    const context = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
    const startedAt = Number(context?.startedAt);
    const age = Date.now() - startedAt;
    if (!Number.isFinite(startedAt) || !context?.userId || context.userId !== userId || age < 0 || age > RECOVERY_CONTEXT_MAX_AGE_MS) {
      clearPasswordRecoveryContext();
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[Auth] Could not read password recovery context:', error?.name ?? 'unknown');
    return false;
  }
};

export const initPasswordRecoveryListener = (client = getSupabaseClient()) => {
  if (!client?.auth?.onAuthStateChange) return null;
  return client.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      markPasswordRecoveryContext(session);
    } else if (event === 'SIGNED_OUT') {
      clearPasswordRecoveryContext();
    }
  });
};

initPasswordRecoveryListener();
