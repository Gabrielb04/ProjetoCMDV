import type { Vehicle } from '../types';
import { requireSupabaseClient } from './supabase';

type VehicleRow = {
  id: string;
  brand: string;
  brand_id: string | null;
  model: string;
  year: number;
  plate: string;
  current_km: number;
};

function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    brand: row.brand,
    brandId: row.brand_id ?? undefined,
    model: row.model,
    year: row.year,
    plate: row.plate,
    currentKm: row.current_km,
  };
}

export const vehicleService = {
  async list(userId: string): Promise<Vehicle[]> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .select('id, brand, brand_id, model, year, plate, current_km')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapVehicle);
  },

  async create(userId: string, vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const client = requireSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .insert({
        user_id: userId,
        brand: vehicle.brand,
        brand_id: vehicle.brandId ?? null,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        current_km: vehicle.currentKm,
      })
      .select('id, brand, brand_id, model, year, plate, current_km')
      .single();

    if (error) throw error;
    return mapVehicle(data);
  },

  async updateKm(vehicleId: string, currentKm: number): Promise<void> {
    const client = requireSupabaseClient();
    const { error } = await client
      .from('vehicles')
      .update({ current_km: currentKm, updated_at: new Date().toISOString() })
      .eq('id', vehicleId);

    if (error) throw error;
  },

  async remove(vehicleId: string): Promise<void> {
    const client = requireSupabaseClient();
    const { error } = await client.from('vehicles').delete().eq('id', vehicleId);
    if (error) throw error;
  },
};
