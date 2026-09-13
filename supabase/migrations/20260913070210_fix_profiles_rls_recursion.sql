-- Fix infinite recursion (42P17) in profiles SELECT policy
-- Uses SECURITY DEFINER function to avoid self-referencing RLS recursion

CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('committee', 'admin', 'super_admin')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_or_super_admin() TO authenticated, anon;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
FOR SELECT USING (
  (auth.uid() = id) OR public.is_admin_or_super_admin()
);
