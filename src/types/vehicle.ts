export interface Vehicle {
  id: string;
  brand: string;
  brandId?: string; // ID da marca para buscar o logo
  model: string;
  year: number;
  plate: string;
  currentKm: number;
}