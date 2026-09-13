import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const policySql = readFileSync(fileURLToPath(new URL('./storage_policies.sql', import.meta.url)), 'utf8');

describe('participant document Storage policy contract', () => {
  it('keeps the bucket private and constrained to the approved file types and size', () => {
    expect(policySql).toContain("'participant-documents'");
    expect(policySql).toContain('false');
    expect(policySql).toContain('5242880');
    expect(policySql).toContain("array['application/pdf', 'image/jpeg', 'image/png']");
  });

  it('requires exact paths and registration ownership for participant writes', () => {
    expect(policySql).toContain('array_length(parts, 1) = 4');
    expect(policySql).toContain("parts := string_to_array(path, '/');");
    expect(policySql).toContain('private.storage_registration_matches(name, true)');
    expect(policySql).toContain('public.document_storage_user_id(name) = (select auth.uid())');
  });

  it('keeps privileged reads and deletes assignment-scoped', () => {
    expect(policySql).toContain('private.storage_verifier_authorized(name)');
    expect(policySql).toContain('private.storage_competition_admin_authorized(name)');
    expect(policySql).toContain('private.is_super_admin()');
    expect(policySql).not.toContain('create or replace function public.storage_registration_matches');
    expect(policySql).not.toContain('create or replace function public.storage_verifier_authorized');
    expect(policySql).not.toContain('create or replace function public.storage_competition_admin_authorized');
    expect(policySql).not.toMatch(/for select to authenticated\s+using\s*\(\s*true\s*\)/i);
    expect(policySql).not.toMatch(/for delete to authenticated\s+using\s*\(\s*true\s*\)/i);
  });
});