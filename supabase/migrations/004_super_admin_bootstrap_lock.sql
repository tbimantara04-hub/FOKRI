-- One-time Super Admin bootstrap lock.
-- Run after 001_init_schema.sql and before using /api/provision-super-admin.
-- This table is server-operation state, not a client-writable authorization surface.

create table if not exists public.super_admin_bootstrap_lock (
  id boolean primary key default true check (id = true),
  status text not null default 'available' check (status in ('available', 'claimed', 'consumed')),
  claimed_at timestamptz,
  consumed_at timestamptz,
  check ((status = 'available' and claimed_at is null and consumed_at is null)
    or (status = 'claimed' and claimed_at is not null and consumed_at is null)
    or (status = 'consumed' and consumed_at is not null)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.super_admin_bootstrap_lock (id, status)
values (true, 'available')
on conflict (id) do nothing;

revoke all on table public.super_admin_bootstrap_lock from anon, authenticated;
grant select, update on table public.super_admin_bootstrap_lock to service_role;

create or replace function public.handle_super_admin_bootstrap_lock_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists super_admin_bootstrap_lock_updated_at on public.super_admin_bootstrap_lock;
create trigger super_admin_bootstrap_lock_updated_at
before update on public.super_admin_bootstrap_lock
for each row execute procedure public.handle_super_admin_bootstrap_lock_updated_at();
