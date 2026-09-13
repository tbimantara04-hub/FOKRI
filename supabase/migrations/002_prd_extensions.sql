create table if not exists public.competition_categories (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  name text not null,
  description text,
  registration_mode text not null default 'individual' check (registration_mode in ('individual','team','both')),
  min_members integer default 1,
  max_members integer default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_requirements (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  name text not null,
  applies_to text not null default 'both' check (applies_to in ('individual','team','both')),
  required boolean not null default true,
  allowed_types text[] not null default array['pdf'],
  max_size_mb integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competition_milestones (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  kind text not null default 'milestone',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.result_change_requests (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  previous_value jsonb not null,
  proposed_value jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reason text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id)
);

create index if not exists idx_competition_categories_competition on public.competition_categories(competition_id);
create index if not exists idx_document_requirements_competition on public.document_requirements(competition_id);
create index if not exists idx_milestones_competition on public.competition_milestones(competition_id);
create index if not exists idx_result_change_requests_status on public.result_change_requests(status);

drop trigger if exists competition_categories_updated_at on public.competition_categories;
create trigger competition_categories_updated_at
before update on public.competition_categories
for each row execute procedure public.handle_updated_at();

drop trigger if exists document_requirements_updated_at on public.document_requirements;
create trigger document_requirements_updated_at
before update on public.document_requirements
for each row execute procedure public.handle_updated_at();

drop trigger if exists competition_milestones_updated_at on public.competition_milestones;
create trigger competition_milestones_updated_at
before update on public.competition_milestones
for each row execute procedure public.handle_updated_at();

alter table public.competition_categories enable row level security;
alter table public.document_requirements enable row level security;
alter table public.competition_milestones enable row level security;
alter table public.result_change_requests enable row level security;

create policy "competition_categories_select_public" on public.competition_categories
for select using (true);

create policy "competition_categories_manage_admin" on public.competition_categories
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);

create policy "document_requirements_select_public" on public.document_requirements
for select using (true);

create policy "document_requirements_manage_admin" on public.document_requirements
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);

create policy "competition_milestones_select_public" on public.competition_milestones
for select using (true);

create policy "competition_milestones_manage_admin" on public.competition_milestones
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);

create policy "result_change_requests_select_admin" on public.result_change_requests
for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);

create policy "result_change_requests_insert_admin" on public.result_change_requests
for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);

create policy "result_change_requests_update_admin" on public.result_change_requests
for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);
