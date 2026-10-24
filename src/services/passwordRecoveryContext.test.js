import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  markPasswordRecoveryContext,
  clearPasswordRecoveryContext,
  hasPasswordRecoveryContext,
  initPasswordRecoveryListener,
} from './passwordRecoveryContext.js';

describe('passwordRecoveryContext', () => {
  const STORAGE_KEY = 'fokri_password_recovery_started_at';
  let storageMap = {};

  beforeEach(() => {
    storageMap = {};
    const sessionStorageMock = {
      getItem: vi.fn((key) => storageMap[key] || null),
      setItem: vi.fn((key, value) => {
        storageMap[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete storageMap[key];
      }),
    };

    vi.stubGlobal('sessionStorage', sessionStorageMock);
    vi.stubGlobal('window', {
      sessionStorage: sessionStorageMock,
      location: { hash: '' },
    });
  });

  it('marks password recovery context in sessionStorage', () => {
    markPasswordRecoveryContext({ user: { id: 'user-xyz' } });

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"userId":"user-xyz"')
    );
  });

  it('confirms recovery context when session is within valid time window', () => {
    storageMap[STORAGE_KEY] = JSON.stringify({
      startedAt: Date.now() - 5000,
      userId: 'user-xyz',
    });

    expect(hasPasswordRecoveryContext('user-xyz')).toBe(true);
  });

  it('rejects and clears context when expired (> 1 hour)', () => {
    storageMap[STORAGE_KEY] = JSON.stringify({
      startedAt: Date.now() - (60 * 60 * 1000 + 1000),
      userId: 'user-xyz',
    });

    expect(hasPasswordRecoveryContext('user-xyz')).toBe(false);
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('rejects context when user ID does not match', () => {
    storageMap[STORAGE_KEY] = JSON.stringify({
      startedAt: Date.now() - 5000,
      userId: 'other-user',
    });

    expect(hasPasswordRecoveryContext('user-xyz')).toBe(false);
  });

  it('detects and marks context from URL hash containing type=recovery', () => {
    window.location.hash = '#access_token=dummy&type=recovery&expires_in=3600';

    expect(hasPasswordRecoveryContext('user-123')).toBe(true);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"userId":"user-123"')
    );
  });

  it('clears password recovery context upon request', () => {
    storageMap[STORAGE_KEY] = JSON.stringify({
      startedAt: Date.now(),
      userId: 'user-123',
    });

    clearPasswordRecoveryContext();

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('initializes auth listener and triggers handlers accordingly', () => {
    let authCallback = null;
    const mockClient = {
      auth: {
        onAuthStateChange: vi.fn((cb) => {
          authCallback = cb;
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
      },
    };

    initPasswordRecoveryListener(mockClient);
    expect(mockClient.auth.onAuthStateChange).toHaveBeenCalledOnce();

    // Trigger PASSWORD_RECOVERY
    authCallback('PASSWORD_RECOVERY', { user: { id: 'recovered-user' } });
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('"userId":"recovered-user"')
    );

    // Trigger SIGNED_OUT
    authCallback('SIGNED_OUT', null);
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
