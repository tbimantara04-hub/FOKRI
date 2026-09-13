import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
const authService = readFileSync(`${sourceRoot}services/authService.js`, 'utf8');
const clientSupabase = readFileSync(`${sourceRoot}lib/supabase.js`, 'utf8');
const bootstrap = readFileSync(new URL('../../api/provision-super-admin.js', import.meta.url), 'utf8');

const envExample = readFileSync(new URL('../../.env.example', import.meta.url), 'utf8');

describe('super admin security boundaries', () => {
  it('keeps public signup participant-only', () => {
    expect(authService).toContain("role: 'participant'");
    expect(authService).not.toContain('SUPER_ADMIN_BOOTSTRAP');
  });

  it('keeps the secret out of Vite client configuration', () => {
    const secretName = ['SUPABASE', 'SECRET_KEY'].join('_');
    expect(clientSupabase).not.toContain(secretName);
    expect(clientSupabase).not.toContain(['service', 'role'].join('_'));
    expect(envExample).not.toMatch(/VITE_.*SUPABASE_SECRET_KEY/i);
    expect(bootstrap).toContain(secretName);
  });

  it('does not expose a frontend provisioning call or role selector', () => {
    expect(authService).not.toContain('admin.createUser');
  });
});
