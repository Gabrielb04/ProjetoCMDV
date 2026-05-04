-- Fase 4: utilitários de atualização automática para tabelas editáveis.
-- Rode esta migration depois da 001 e 002.

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
