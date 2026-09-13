create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  institution text,
  role text not null default 'participant' check (role in ('participant','committee','admin','super_admin')),
  status text not null default 'active' check (status in ('active','inactive','pending','suspended')),
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text,
  type text,
  status text not null default 'draft' check (status in ('draft','registration_open','registration_closed','published','completed','results_published','cancelled','archived')),
  registration_open timestamptz,
  registration_close timestamptz,
  quota integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,
  competition_id uuid not null references public.competitions(id) on delete cascade,
  team_id uuid,
  status text not null default 'DRAFT' check (status in ('DRAFT','SUBMITTED','UNDER_REVIEW','REVISION_REQUIRED','APPROVED','REJECTED','CANCELLED')),
  submitted_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid not null references public.profiles(id) on delete cascade,
  competition_id uuid not null references public.competitions(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competition_admins (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','co_admin')),
  created_at timestamptz not null default now(),
  unique(competition_id, user_id)
);

create table if not exists public.verifier_assignments (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'verifier' check (role in ('verifier','lead_verifier')),
  created_at timestamptz not null default now(),
  unique(competition_id, user_id)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(team_id, user_id),
  unique(user_id, competition_id)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  competition_id uuid not null references public.competitions(id) on delete cascade,
  document_requirement_id uuid,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected','revision_required')),
  uploaded_at timestamptz not null default now(),
  verified_at timestamptz
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references public.competitions(id) on delete cascade,
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finalists (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  team_id uuid,
  ranking integer,
  status text not null default 'shortlisted' check (status in ('shortlisted','finalist','winner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  registration_id uuid not null references public.registrations(id) on delete cascade,
  team_id uuid,
  ranking integer,
  score numeric,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_registrations_user_competition on public.registrations(user_id, competition_id);
create index if not exists idx_registrations_competition_status on public.registrations(competition_id, status);
create index if not exists idx_registrations_status on public.registrations(status);
create index if not exists idx_documents_registration on public.documents(registration_id);
create index if not exists idx_documents_competition_status on public.documents(competition_id, verification_status);
create index if not exists idx_team_members_user_competition on public.team_members(user_id, competition_id);
create index if not exists idx_teams_competition_leader on public.teams(competition_id, leader_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_competition_admins_competition on public.competition_admins(competition_id);
create index if not exists idx_verifier_assignments_competition on public.verifier_assignments(competition_id);
create index if not exists idx_finalists_competition on public.finalists(competition_id, status);
create index if not exists idx_results_competition on public.results(competition_id, status);
create index if not exists idx_competitions_status on public.competitions(status);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'super_admin'
  );
$$;

create or replace function public.is_competition_admin_for(p_competition_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.competition_admins ca
    where ca.user_id = auth.uid()
      and ca.competition_id = p_competition_id
  );
$$;

create or replace function public.is_verifier_for(p_competition_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.verifier_assignments va
    where va.user_id = auth.uid()
      and va.competition_id = p_competition_id
  );
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger competitions_updated_at
before update on public.competitions
for each row execute procedure public.handle_updated_at();

create trigger registrations_updated_at
before update on public.registrations
for each row execute procedure public.handle_updated_at();

create trigger teams_updated_at
before update on public.teams
for each row execute procedure public.handle_updated_at();

create trigger announcements_updated_at
before update on public.announcements
for each row execute procedure public.handle_updated_at();

create trigger finalists_updated_at
before update on public.finalists
for each row execute procedure public.handle_updated_at();

create trigger results_updated_at
before update on public.results
for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, institution, role, status, email_verified_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'FOKRI User'),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'institution',
    'participant',
    'active',
    new.email_confirmed_at
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    institution = excluded.institution,
    role = excluded.role,
    status = excluded.status,
    email_verified_at = excluded.email_verified_at;

  return new;
end;
$$ language plpgsql security definer;

create or replace function public.protect_profile_fields()
returns trigger as $$
begin
  if auth.uid() = old.id and not public.is_super_admin() then
    new.role = old.role;
    new.status = old.status;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
before update on public.profiles
for each row execute procedure public.protect_profile_fields();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.validate_document_binding()
returns trigger as $$
begin
  if NEW.registration_id is null or NEW.uploaded_by is null then
    raise exception 'Document must include registration and owner.';
  end if;

  if not exists (
    select 1 from public.registrations r
    where r.id = NEW.registration_id
      and r.user_id = NEW.uploaded_by
  ) then
    raise exception 'Participant cannot attach a document to a registration they do not own.';
  end if;

  if NEW.competition_id is null then
    raise exception 'Document must include competition_id.';
  end if;

  if exists (
    select 1 from public.registrations r
    where r.id = NEW.registration_id
      and r.competition_id <> NEW.competition_id
  ) then
    raise exception 'Document competition_id must match the registration competition.';
  end if;

  if NEW.document_requirement_id is not null and not exists (
    select 1 from public.document_requirements dr
    where dr.id = NEW.document_requirement_id
      and dr.competition_id = NEW.competition_id
  ) then
    raise exception 'Document requirement must belong to the same competition.';
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger documents_binding_guard
before insert or update on public.documents
for each row execute procedure public.validate_document_binding();

create unique index if not exists ux_registrations_active_per_user_competition
on public.registrations (user_id, competition_id)
where status in ('SUBMITTED','UNDER_REVIEW','REVISION_REQUIRED','APPROVED');

alter table public.profiles enable row level security;
alter table public.competitions enable row level security;
alter table public.registrations enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.documents enable row level security;
alter table public.announcements enable row level security;
alter table public.finalists enable row level security;
alter table public.results enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.competition_admins enable row level security;
alter table public.verifier_assignments enable row level security;

create policy "competition_admins_select_admin_only" on public.competition_admins
for select using (
  public.is_super_admin()
  or user_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "competition_admins_manage_super_admin" on public.competition_admins
for all using (public.is_super_admin())
with check (public.is_super_admin());

create policy "verifier_assignments_select_assigned_or_admin" on public.verifier_assignments
for select using (
  public.is_super_admin()
  or user_id = auth.uid()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = verifier_assignments.competition_id
      and ca.user_id = auth.uid()
  )
);

create policy "verifier_assignments_manage_admin" on public.verifier_assignments
for all using (
  public.is_super_admin()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = verifier_assignments.competition_id
      and ca.user_id = auth.uid()
  )
)
with check (
  public.is_super_admin()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = verifier_assignments.competition_id
      and ca.user_id = auth.uid()
  )
);

create policy "profiles_select_own_or_admin" on public.profiles
for select using (
  auth.uid() = id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('committee','admin','super_admin')
  )
);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_delete_admin_only" on public.profiles
for delete using (
  public.is_super_admin()
);

create policy "competitions_select_public_when_published" on public.competitions
for select using (status in ('published','completed','results_published','registration_open','registration_closed'));

create policy "competitions_insert_admin_only" on public.competitions
for insert with check (
  public.is_super_admin() or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "competitions_update_admin_only" on public.competitions
for update using (
  public.is_super_admin() or public.is_competition_admin_for(id)
)
with check (
  public.is_super_admin() or public.is_competition_admin_for(id)
);

create policy "competitions_delete_admin_only" on public.competitions
for delete using (
  public.is_super_admin()
);

create policy "registrations_select_own_or_assigned" on public.registrations
for select using (
  auth.uid() = user_id
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "registrations_insert_own" on public.registrations
for insert with check (auth.uid() = user_id);

create policy "registrations_update_own_or_assigned" on public.registrations
for update using (
  auth.uid() = user_id
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
)
with check (
  auth.uid() = user_id
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "registrations_delete_admin_only" on public.registrations
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "teams_select_related" on public.teams
for select using (
  auth.uid() = leader_id
  or exists (select 1 from public.team_members tm where tm.team_id = teams.id and tm.user_id = auth.uid())
  or public.is_competition_admin_for(competition_id)
  or public.is_verifier_for(competition_id)
  or public.is_super_admin()
);

create policy "teams_insert_own" on public.teams
for insert with check (auth.uid() = leader_id);

create policy "teams_update_own_or_admin" on public.teams
for update using (
  auth.uid() = leader_id
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
)
with check (
  auth.uid() = leader_id
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "teams_delete_admin_only" on public.teams
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "team_members_select_related" on public.team_members
for select using (
  auth.uid() = user_id
  or exists (select 1 from public.teams t where t.id = team_members.team_id and t.leader_id = auth.uid())
  or public.is_competition_admin_for(competition_id)
  or public.is_verifier_for(competition_id)
  or public.is_super_admin()
);

create policy "team_members_insert_own_or_admin" on public.team_members
for insert with check (
  auth.uid() = user_id
  or exists (select 1 from public.teams t where t.id = team_members.team_id and t.leader_id = auth.uid())
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "team_members_update_own_or_admin" on public.team_members
for update using (
  auth.uid() = user_id
  or exists (select 1 from public.teams t where t.id = team_members.team_id and t.leader_id = auth.uid())
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
)
with check (
  auth.uid() = user_id
  or exists (select 1 from public.teams t where t.id = team_members.team_id and t.leader_id = auth.uid())
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "team_members_delete_admin_only" on public.team_members
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "documents_select_owner_or_assigned" on public.documents
for select using (
  auth.uid() = uploaded_by
  or exists (
    select 1 from public.registrations r where r.id = documents.registration_id and r.user_id = auth.uid()
  )
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "documents_insert_own" on public.documents
for insert with check (
  auth.uid() = uploaded_by
  or exists (
    select 1 from public.registrations r where r.id = documents.registration_id and r.user_id = auth.uid()
  )
);

create policy "documents_update_owner_or_assigned" on public.documents
for update using (
  auth.uid() = uploaded_by
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
)
with check (
  auth.uid() = uploaded_by
  or public.is_verifier_for(competition_id)
  or public.is_competition_admin_for(competition_id)
  or public.is_super_admin()
);

create policy "documents_delete_admin_only" on public.documents
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "announcements_select_published" on public.announcements
for select using (status = 'published');

create policy "announcements_insert_admin_only" on public.announcements
for insert with check (
  public.is_super_admin()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = announcements.competition_id
      and ca.user_id = auth.uid()
  )
);

create policy "announcements_update_admin_only" on public.announcements
for update using (
  public.is_super_admin()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = announcements.competition_id
      and ca.user_id = auth.uid()
  )
)
with check (
  public.is_super_admin()
  or exists (
    select 1 from public.competition_admins ca
    where ca.competition_id = announcements.competition_id
      and ca.user_id = auth.uid()
  )
);

create policy "announcements_delete_admin_only" on public.announcements
for delete using (
  public.is_super_admin()
);

create policy "finalists_select_public" on public.finalists
for select using (true);

create policy "finalists_insert_admin_only" on public.finalists
for insert with check (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "finalists_update_admin_only" on public.finalists
for update using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
)
with check (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "finalists_delete_admin_only" on public.finalists
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "results_select_public_published" on public.results
for select using (status = 'published');

create policy "results_insert_admin_only" on public.results
for insert with check (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "results_update_admin_draft_only" on public.results
for update using (
  (status <> 'published' and (public.is_super_admin() or public.is_competition_admin_for(competition_id)))
)
with check (
  (status <> 'published' and (public.is_super_admin() or public.is_competition_admin_for(competition_id)))
);

create policy "results_delete_admin_only" on public.results
for delete using (
  public.is_super_admin() or public.is_competition_admin_for(competition_id)
);

create policy "notifications_select_own" on public.notifications
for select using (auth.uid() = user_id);

create policy "notifications_insert_admin_or_system" on public.notifications
for insert with check (
  auth.uid() = user_id
  or public.is_super_admin()
  or public.is_competition_admin_for((select r.competition_id from public.registrations r where r.user_id = user_id limit 1))
);

create policy "notifications_update_own" on public.notifications
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notifications_delete_own_or_admin" on public.notifications
for delete using (
  auth.uid() = user_id or public.is_super_admin()
);

create policy "audit_logs_select_admin_only" on public.audit_logs
for select using (
  public.is_super_admin() or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','committee')
  )
);

create policy "audit_logs_insert_server_only" on public.audit_logs
for insert with check (false);

create policy "audit_logs_update_admin_only" on public.audit_logs
for update using (false)
with check (false);

create policy "audit_logs_delete_admin_only" on public.audit_logs
for delete using (false);
