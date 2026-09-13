import { describe, expect, it } from 'vitest';
import { resolveAuthMode } from './authMode.js';

describe('resolveAuthMode', () => {
  it('prefers signup when the query param is set', () => {
    expect(resolveAuthMode(false, 'signup')).toBe('signup');
  });

  it('falls back to login for admin-only screens', () => {
    expect(resolveAuthMode(true, 'signup')).toBe('login');
  });

  it('defaults to login when no mode is provided', () => {
    expect(resolveAuthMode(false, null)).toBe('login');
  });
});
