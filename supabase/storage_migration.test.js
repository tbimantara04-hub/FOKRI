import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const migrationSql = readFileSync(
  fileURLToPath(new URL('./migrations/003_storage_security_hardening.sql', import.meta.url)),
  'utf8'
);
const executableSql = migrationSql.replace(/^\s*--.*$/gm, '');

const policyNames = [
  'participant_documents_upload_own_folder',
  'participant_documents_read_own_or_assigned',
  'participant_documents_update_own',
  'participant_documents_delete_own_or_admin'
];

describe('remote-safe Storage hardening migration', () => {
  it('replaces exactly the four existing Storage policies', () => {
    for (const policyName of policyNames) {
      expect(migrationSql.match(new RegExp(policyName, 'g'))).toHaveLength(2);
      expect(migrationSql).toContain(`drop policy if exists "${policyName}" on storage.objects`);
      expect(migrationSql).toContain(`create policy "${policyName}"`);
    }
  });

  it('includes hardened path and assignment authorization dependencies', () => {
    expect(migrationSql).toContain('array_length(parts, 1) = 4');
    expect(migrationSql).toContain("parts := string_to_array(path, '/');");
    expect(migrationSql).toContain('private.storage_registration_matches');
    expect(migrationSql).toContain('private.storage_verifier_authorized');
    expect(migrationSql).toContain('private.storage_competition_admin_authorized');
    expect(migrationSql).toContain('private.is_super_admin()');
    expect(migrationSql).toContain('create schema if not exists private');
    expect(migrationSql).toContain('revoke usage on schema private from public');
    expect(migrationSql).toContain('grant usage on schema private to authenticated');
  });

  it('revokes default PUBLIC execution and retains authenticated RLS execution', () => {
    const functions = [
      ['private', 'is_super_admin()'],
      ['public', 'is_valid_document_storage_path(text)'],
      ['public', 'document_storage_user_id(text)'],
      ['public', 'document_storage_competition_id(text)'],
      ['public', 'document_storage_registration_id(text)'],
      ['private', 'storage_registration_matches(text, boolean)'],
      ['private', 'storage_verifier_authorized(text)'],
      ['private', 'storage_competition_admin_authorized(text)']
    ];

    for (const [schema, functionSignature] of functions) {
      expect(migrationSql).toContain(`revoke execute on function ${schema}.${functionSignature} from public`);
      expect(migrationSql).toContain(`grant execute on function ${schema}.${functionSignature} to authenticated`);
    }
  });

  it('does not modify Auth, profiles, registrations, or role schema', () => {
    expect(executableSql).not.toMatch(/auth\.users|create table|alter table|profiles\.role|insert into public\.profiles/i);
    expect(migrationSql).toContain("'participant-documents'");
    expect(migrationSql).toContain('false');
    expect(migrationSql).toContain('5242880');
  });
});
