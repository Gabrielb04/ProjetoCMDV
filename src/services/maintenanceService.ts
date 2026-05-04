import type { MaintenanceItem, MaintenanceRecord } from '../types';
import { requireSupabaseClient } from './supabase';

const toDate = (value: string | null | undefined) => (value ? new Date(`${value}T00:00:00`) : undefined);
const toDateString = (value?: Date) => (value ? value.toISOString().slice(0, 10) : null);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const nullableUuid = (value?: string | null) => (value && uuidRegex.test(value) ? value : null);

type MaintenanceItemRow = {
  id: string;
  name: string;
  type: 'parts' | 'service';
  alert_km: number | null;
  alert_date: string | null;
  km_base: number;
  last_maintenance_date: string;
  cost: number | null;
  notes: string | null;
};

type MaintenanceRecordRow = {
  id: string;
  item_id: string | null;
  item_name: string;
  date: string;
  km: number;
  cost: number | null;
  notes: string | null;
};

function mapItem(row: MaintenanceItemRow): MaintenanceItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    alertKm: row.alert_km ?? undefined,
    alertDate: toDate(row.alert_date),
    kmBase: row.km_base,
    lastMaintenanceDate: toDate(row.last_maintenance_date) ?? new Date(),
    status: 'ok',
    progress: 0,
    dateProgress: 0,
    cost: row.cost ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function mapRecord(row: MaintenanceRecordRow): MaintenanceRecord {
  return {
    id: row.id,
    itemId: row.item_id ?? 'no-alert',
    itemName: row.item_name,
    date: toDate(row.date) ?? new Date(),
    km: row.km,
    notes: row.notes ?? undefined,
    cost: row.cost ?? undefined,
  };
}

export const maintenanceService = {
  async listItems(userId: string, vehicleId: string): Promise<MaintenanceItem[]> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('maintenance_items')
      .select('id, name, type, alert_km, alert_date, km_base, last_maintenance_date, cost, notes')
      .eq('user_id', userId)
      .eq('vehicle_id', vehicleId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapItem);
  },

  async listRecords(userId: string, vehicleId: string): Promise<MaintenanceRecord[]> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('maintenance_records')
      .select('id, item_id, item_name, date, km, cost, notes')
      .eq('user_id', userId)
      .eq('vehicle_id', vehicleId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapRecord);
  },

  async createItem(
    userId: string,
    vehicleId: string,
    item: Omit<MaintenanceItem, 'id' | 'status' | 'progress' | 'dateProgress'>
  ): Promise<MaintenanceItem> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('maintenance_items')
      .insert({
        user_id: userId,
        vehicle_id: vehicleId,
        name: item.name,
        type: item.type,
        alert_km: item.alertKm ?? null,
        alert_date: toDateString(item.alertDate),
        km_base: item.kmBase,
        last_maintenance_date: toDateString(item.lastMaintenanceDate),
        cost: item.cost ?? null,
        notes: item.notes ?? null,
      })
      .select('id, name, type, alert_km, alert_date, km_base, last_maintenance_date, cost, notes')
      .single();

    if (error) throw error;
    return mapItem(data);
  },

  async updateItem(
    itemId: string,
    updates: Partial<Pick<MaintenanceItem, 'kmBase' | 'lastMaintenanceDate' | 'alertDate' | 'cost' | 'notes'>>
  ): Promise<MaintenanceItem> {
    const client = requireSupabaseClient();
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (updates.kmBase !== undefined) payload.km_base = updates.kmBase;
    if (updates.lastMaintenanceDate !== undefined) payload.last_maintenance_date = toDateString(updates.lastMaintenanceDate);
    if (updates.alertDate !== undefined) payload.alert_date = toDateString(updates.alertDate);
    if (updates.cost !== undefined) payload.cost = updates.cost ?? null;
    if (updates.notes !== undefined) payload.notes = updates.notes ?? null;

    const { data, error } = await client
      .from('maintenance_items')
      .update(payload)
      .eq('id', itemId)
      .select('id, name, type, alert_km, alert_date, km_base, last_maintenance_date, cost, notes')
      .single();

    if (error) throw error;
    return mapItem(data);
  },

  async createRecord(userId: string, vehicleId: string, record: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('maintenance_records')
      .insert({
        user_id: userId,
        vehicle_id: vehicleId,
        item_id: nullableUuid(record.itemId),
        item_name: record.itemName,
        date: toDateString(record.date),
        km: record.km,
        cost: record.cost ?? null,
        notes: record.notes ?? null,
      })
      .select('id, item_id, item_name, date, km, cost, notes')
      .single();

    if (error) throw error;
    return mapRecord(data);
  },

  async removeItems(itemIds: string[]): Promise<void> {
    if (itemIds.length === 0) return;
    const client = requireSupabaseClient();
    const { error } = await client.from('maintenance_items').delete().in('id', itemIds);
    if (error) throw error;
  },

  async removeRecords(recordIds: string[]): Promise<void> {
    if (recordIds.length === 0) return;
    const client = requireSupabaseClient();
    const { error } = await client.from('maintenance_records').delete().in('id', recordIds);
    if (error) throw error;
  },
};
