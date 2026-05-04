-- CMDV - Setup completo do banco Supabase
-- Execute este arquivo no Supabase Dashboard > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  brand_id text,
  model text not null,
  year int not null,
  plate text not null,
  current_km int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicles_year_valid check (year between 1900 and extract(year from now())::int + 1),
  constraint vehicles_current_km_non_negative check (current_km >= 0)
);

create table if not exists public.maintenance_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('parts', 'service')),
  alert_km int,
  alert_date date,
  km_base int not null,
  last_maintenance_date date not null,
  cost numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maintenance_items_km_base_non_negative check (km_base >= 0),
  constraint maintenance_items_alert_km_positive check (alert_km is null or alert_km > 0)
);

create table if not exists public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  item_id uuid references public.maintenance_items(id) on delete set null,
  item_name text not null,
  date date not null,
  km int not null,
  cost numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  constraint maintenance_records_km_non_negative check (km >= 0)
);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.maintenance_items enable row level security;
alter table public.maintenance_records enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can manage own vehicles" on public.vehicles;
create policy "Users can manage own vehicles" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own maintenance items" on public.maintenance_items;
create policy "Users can manage own maintenance items" on public.maintenance_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage own maintenance records" on public.maintenance_records;
create policy "Users can manage own maintenance records" on public.maintenance_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
    set name = excluded.name,
        email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

drop trigger if exists set_maintenance_items_updated_at on public.maintenance_items;
create trigger set_maintenance_items_updated_at
before update on public.maintenance_items
for each row execute function public.set_updated_at();


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

create index if not exists idx_vehicles_user_id_updated_at
  on public.vehicles (user_id, updated_at desc);

create index if not exists idx_maintenance_items_vehicle_id_updated_at
  on public.maintenance_items (vehicle_id, updated_at desc);

create index if not exists idx_maintenance_records_vehicle_id_date
  on public.maintenance_records (vehicle_id, date desc, created_at desc);

-- Opcional: cria profiles para usuários já existentes antes do trigger.
insert into public.profiles (id, name, email)
select
  id,
  coalesce(nullif(raw_user_meta_data->>'name', ''), split_part(email, '@', 1)),
  email
from auth.users
on conflict (id) do nothing;
