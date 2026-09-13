import { describe, expect, it } from 'vitest';
import { mapSupabaseRoleToAppRole } from './authService.js';
import { ROLES } from '../auth/authModel.js';

describe('Supabase role adapter', () => {
  it('maps a provisioned super_admin to the frontend admin role', () => {
    expect(mapSupabaseRoleToAppRole('super_admin')).toBe(ROLES.SUPER_ADMIN);
  });

  it('maps database committee and admin roles to existing route roles', () => {
    expect(mapSupabaseRoleToAppRole('committee')).toBe(ROLES.VERIFIER);
    expect(mapSupabaseRoleToAppRole('admin')).toBe(ROLES.COMPETITION_ADMIN);
  });
});