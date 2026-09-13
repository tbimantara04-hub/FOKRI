-- Development seed data only. Not for production.
-- The following accounts are clearly example-only and must be replaced with real Supabase auth users in production.

-- Team admin and participant examples should be provisioned via Supabase Auth or a secure server-side admin function.
-- This file provides safe development schema examples only.

insert into public.profiles (id, name, email, phone, institution, role, status, email_verified_at)
values
  ('11111111-1111-4111-8111-111111111111', 'Super Admin FOKRI', 'superadmin.dev@fokri.games', '081200000001', 'Panitia FOKRI', 'super_admin', 'active', now()),
  ('22222222-2222-4222-8222-222222222222', 'Committee Verifier', 'committee.dev@fokri.games', '081200000002', 'Panitia FOKRI', 'committee', 'active', now()),
  ('33333333-3333-4333-8333-333333333333', 'Peserta Demo', 'participant.dev@fokri.games', '081200000003', 'Universitas Demo', 'participant', 'active', now())
on conflict (id) do nothing;

insert into public.competitions (id, name, slug, description, category, type, status, registration_open, registration_close, quota)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Kompetisi Demo', 'demo-competition', 'Development-only competition placeholder.', 'TBD', 'TBD', 'draft', now(), now() + interval '30 days', 25)
on conflict (id) do nothing;
