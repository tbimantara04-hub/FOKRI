-- Run after the database migrations.
-- This creates a private bucket for participant documents.

create schema if not exists private;
revoke usage on schema private from public;
grant usage on schema private to authenticated;

do $$
begin
  if to_regprocedure('public.is_super_admin()') is not null
     and to_regprocedure('private.is_super_admin()') is null then
    alter function public.is_super_admin() set schema private;
  end if;

  if to_regprocedure('public.storage_registration_matches(text,boolean)') is not null
     and to_regprocedure('private.storage_registration_matches(text,boolean)') is null then
    alter function public.storage_registration_matches(text, boolean) set schema private;
  end if;

  if to_regprocedure('public.storage_verifier_authorized(text)') is not null
     and to_regprocedure('private.storage_verifier_authorized(text)') is null then
    alter function public.storage_verifier_authorized(text) set schema private;
  end if;

  if to_regprocedure('public.storage_competition_admin_authorized(text)') is not null
     and to_regprocedure('private.storage_competition_admin_authorized(text)') is null then
    alter function public.storage_competition_admin_authorized(text) set schema private;
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'participant-documents',
  'participant-documents',
  false,
  5242880,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.is_valid_document_storage_path(path text)
returns boolean
language plpgsql
immutable
as $$
declare
  parts text[];
begin
  if path is null then return false; end if;
  parts := string_to_array(path, '/');

  return array_length(parts, 1) = 4
    and parts[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and parts[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and parts[3] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and parts[4] <> ''
    and parts[4] not in ('.', '..')
    and parts[4] !~ '[[:cntrl:]]'
    and position('..' in parts[4]) = 0
    and position(E'\\' in parts[4]) = 0;
end;
$$;

create or replace function public.document_storage_user_id(path text)
returns uuid
language plpgsql
immutable
as $$
begin
  if not public.is_valid_document_storage_path(path) then return null; end if;
  return (string_to_array(path, '/'))[1]::uuid;
end;
$$;

create or replace function public.document_storage_competition_id(path text)
returns uuid
language plpgsql
immutable
as $$
begin
  if not public.is_valid_document_storage_path(path) then return null; end if;
  return (string_to_array(path, '/'))[2]::uuid;
end;
$$;

create or replace function public.document_storage_registration_id(path text)
returns uuid
language plpgsql
immutable
as $$
begin
  if not public.is_valid_document_storage_path(path) then return null; end if;
  return (string_to_array(path, '/'))[3]::uuid;
end;
$$;

create or replace function private.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.role = 'super_admin'
  );
$$;

create or replace function private.storage_registration_matches(path text, require_owner boolean default false)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select public.is_valid_document_storage_path(path)
    and exists (
      select 1
      from public.registrations r
      where r.id = public.document_storage_registration_id(path)
        and r.competition_id = public.document_storage_competition_id(path)
        and (not require_owner or r.user_id = auth.uid())
        and r.status <> 'CANCELLED'
    );
$$;

create or replace function private.storage_verifier_authorized(path text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select private.storage_registration_matches(path, false)
    and exists (
      select 1
      from public.verifier_assignments va
      join public.profiles p on p.id = va.user_id
      where va.user_id = auth.uid()
        and va.competition_id = public.document_storage_competition_id(path)
        and p.status = 'active'
        and p.role = 'committee'
    );
$$;

create or replace function private.storage_competition_admin_authorized(path text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select private.storage_registration_matches(path, false)
    and exists (
      select 1
      from public.competition_admins ca
      join public.profiles p on p.id = ca.user_id
      where ca.user_id = auth.uid()
        and ca.competition_id = public.document_storage_competition_id(path)
        and p.status = 'active'
        and p.role = 'admin'
    );
$$;

drop policy if exists "participant_documents_upload_own_folder" on storage.objects;
revoke execute on function private.is_super_admin() from public;
grant execute on function private.is_super_admin() to authenticated;
revoke execute on function private.storage_registration_matches(text, boolean) from public;
grant execute on function private.storage_registration_matches(text, boolean) to authenticated;
revoke execute on function private.storage_verifier_authorized(text) from public;
grant execute on function private.storage_verifier_authorized(text) to authenticated;
revoke execute on function private.storage_competition_admin_authorized(text) from public;
grant execute on function private.storage_competition_admin_authorized(text) to authenticated;

create policy "participant_documents_upload_own_folder"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'participant-documents'
  and public.is_valid_document_storage_path(name)
  and public.document_storage_user_id(name) = (select auth.uid())
  and private.storage_registration_matches(name, true)
);

drop policy if exists "participant_documents_read_own_or_assigned" on storage.objects;
create policy "participant_documents_read_own_or_assigned"
on storage.objects
for select to authenticated
using (
  bucket_id = 'participant-documents'
  and public.is_valid_document_storage_path(name)
  and (
    (
      private.storage_registration_matches(name, true)
      and public.document_storage_user_id(name) = (select auth.uid())
    )
    or private.is_super_admin()
    or private.storage_verifier_authorized(name)
    or private.storage_competition_admin_authorized(name)
  )
);

drop policy if exists "participant_documents_update_own" on storage.objects;
create policy "participant_documents_update_own"
on storage.objects
for update to authenticated
using (
  bucket_id = 'participant-documents'
  and private.storage_registration_matches(name, true)
  and public.document_storage_user_id(name) = (select auth.uid())
)
with check (
  bucket_id = 'participant-documents'
  and private.storage_registration_matches(name, true)
  and public.document_storage_user_id(name) = (select auth.uid())
);

drop policy if exists "participant_documents_delete_own_or_admin" on storage.objects;
create policy "participant_documents_delete_own_or_admin"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'participant-documents'
  and public.is_valid_document_storage_path(name)
  and (
    (
      private.storage_registration_matches(name, true)
      and public.document_storage_user_id(name) = (select auth.uid())
    )
    or private.is_super_admin()
    or private.storage_competition_admin_authorized(name)
  )
);
