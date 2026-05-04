-- CMDV - Verificação segura de e-mail para recuperação de senha
-- Execute no Supabase SQL Editor se você já tinha rodado o setup anterior.

create index if not exists idx_profiles_email_lower
  on public.profiles (lower(email));

create or replace function public.email_cadastrado(email_input text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where lower(email) = lower(trim(email_input))
  );
$$;

revoke all on function public.email_cadastrado(text) from public;
grant execute on function public.email_cadastrado(text) to anon, authenticated;
