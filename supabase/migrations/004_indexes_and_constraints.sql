-- Fase 5 - indices, consistencia e performance
-- Rode depois das migrations 001, 002 e 003.

create index if not exists idx_vehicles_user_id_updated_at
  on vehicles (user_id, updated_at desc);

create index if not exists idx_maintenance_items_vehicle_id_updated_at
  on maintenance_items (vehicle_id, updated_at desc);

create index if not exists idx_maintenance_records_vehicle_id_date
  on maintenance_records (vehicle_id, date desc, created_at desc);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_year_valid') then
    alter table vehicles
      add constraint vehicles_year_valid
      check (year between 1900 and extract(year from now())::int + 1);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'vehicles_current_km_non_negative') then
    alter table vehicles
      add constraint vehicles_current_km_non_negative
      check (current_km >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'maintenance_items_km_base_non_negative') then
    alter table maintenance_items
      add constraint maintenance_items_km_base_non_negative
      check (km_base >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'maintenance_items_alert_km_positive') then
    alter table maintenance_items
      add constraint maintenance_items_alert_km_positive
      check (alert_km is null or alert_km > 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'maintenance_records_km_non_negative') then
    alter table maintenance_records
      add constraint maintenance_records_km_non_negative
      check (km >= 0);
  end if;
end $$;
