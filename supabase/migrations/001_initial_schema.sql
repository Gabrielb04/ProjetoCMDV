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
  updated_at timestamptz not null default now()
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
  updated_at timestamptz not null default now()
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
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.maintenance_items enable row level security;
alter table public.maintenance_records enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can manage own vehicles" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own maintenance items" on public.maintenance_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own maintenance records" on public.maintenance_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists vehicles_user_id_idx on public.vehicles(user_id);
create index if not exists maintenance_items_vehicle_id_idx on public.maintenance_items(vehicle_id);
create index if not exists maintenance_records_vehicle_id_idx on public.maintenance_records(vehicle_id);
