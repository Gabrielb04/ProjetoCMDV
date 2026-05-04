/**
 * Dados de marcas e modelos de veículos
 * Sistema completo para seleção visual de marca e modelo
 */

export interface Brand {
  id: string;
  name: string;
  logo: string; // URL do logo
  popular?: boolean; // Se é uma marca popular para exibir na tela principal
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
}

// Marcas populares exibidas na tela principal com logos
export const POPULAR_BRANDS: Brand[] = [
  { 
    id: 'volkswagen', 
    name: 'Volkswagen', 
    logo: 'figma:asset/c0762b14f96b81db88b13ecd00be7ef50ab60ca3.png',
    popular: true 
  },
  { 
    id: 'chevrolet', 
    name: 'Chevrolet', 
    logo: 'figma:asset/3abf4724dd274fac4c34328a760e9c270b5dbc27.png',
    popular: true 
  },
  { 
    id: 'fiat', 
    name: 'Fiat', 
    logo: 'figma:asset/05e78c6e98897898bc5ddf4f4f471a6be40ee5bc.png',
    popular: true 
  },
  { 
    id: 'honda', 
    name: 'Honda', 
    logo: 'figma:asset/96081528d2d03aa26c04433aadb0e49340912e6f.png',
    popular: true 
  },
  { 
    id: 'toyota', 
    name: 'Toyota', 
    logo: 'figma:asset/2d3911414a5edcad409dfcf18475577cba6ccbc3.png',
    popular: true 
  },
  { 
    id: 'ford', 
    name: 'Ford', 
    logo: 'figma:asset/0d381dac51bffa6e971cbf819e1f3c12b6eac996.png',
    popular: true 
  },
  { 
    id: 'hyundai', 
    name: 'Hyundai', 
    logo: 'figma:asset/114ff71236490e77dbd54e8f27db75fb92b69188.png',
    popular: true 
  },
  { 
    id: 'renault', 
    name: 'Renault', 
    logo: 'figma:asset/921945439e162eb1664f600474a88bed59f1d515.png',
    popular: true 
  },
  { 
    id: 'nissan', 
    name: 'Nissan', 
    logo: 'figma:asset/5602fb8dd1ee4da2854779daca8cff05206350e5.png',
    popular: true 
  },
];

// Todas as marcas disponíveis (em ordem alfabética)
export const ALL_BRANDS: Brand[] = [
  { id: 'audi', name: 'Audi', logo: 'figma:asset/e91613a915fc64c2290cd5dadfacd276dd0320c8.png' },
  { id: 'bmw', name: 'BMW', logo: 'figma:asset/36cf619177f6b8edee85f5c273ea8024e9bee4d7.png' },
  { id: 'byd', name: 'BYD', logo: 'figma:asset/fbc33347af3002e211a520ca903829c44efd5d86.png' },
  { id: 'caoa-chery', name: 'Caoa Chery', logo: '' },
  { id: 'chevrolet', name: 'Chevrolet', logo: 'figma:asset/3abf4724dd274fac4c34328a760e9c270b5dbc27.png', popular: true },
  { id: 'citroen', name: 'Citroën', logo: 'figma:asset/67ac8574683f26978321ff21da290fe4a74942bd.png' },
  { id: 'dodge', name: 'Dodge', logo: '' },
  { id: 'ferrari', name: 'Ferrari', logo: 'figma:asset/976abfba0fe5ccfa000a2824a6f9aac88b052811.png' },
  { id: 'fiat', name: 'Fiat', logo: 'figma:asset/05e78c6e98897898bc5ddf4f4f471a6be40ee5bc.png', popular: true },
  { id: 'ford', name: 'Ford', logo: 'figma:asset/0d381dac51bffa6e971cbf819e1f3c12b6eac996.png', popular: true },
  { id: 'great-wall', name: 'Great Wall', logo: '' },
  { id: 'honda', name: 'Honda', logo: 'figma:asset/96081528d2d03aa26c04433aadb0e49340912e6f.png', popular: true },
  { id: 'hyundai', name: 'Hyundai', logo: 'figma:asset/114ff71236490e77dbd54e8f27db75fb92b69188.png', popular: true },
  { id: 'infiniti', name: 'Infiniti', logo: '' },
  { id: 'jac', name: 'JAC', logo: '' },
  { id: 'jaguar', name: 'Jaguar', logo: 'figma:asset/9ddf2339d2c1bb23732fb44a8aaf2b96767e7942.png' },
  { id: 'jeep', name: 'Jeep', logo: 'figma:asset/9f6026f4fc05ba41b326a9885935818a61329b0b.png' },
  { id: 'kia', name: 'Kia', logo: 'figma:asset/360eef4afb55329b58ef5cb6fa6541335b3eefe3.png' },
  { id: 'land-rover', name: 'Land Rover', logo: 'figma:asset/8cf576e61666fc28d4227f9b61bd1e1741ee4f52.png' },
  { id: 'lexus', name: 'Lexus', logo: '' },
  { id: 'lifan', name: 'Lifan', logo: '' },
  { id: 'mazda', name: 'Mazda', logo: '' },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', logo: 'figma:asset/919a1c3e8bee25454ad40852f662d4f301d55134.png' },
  { id: 'mg', name: 'MG', logo: '' },
  { id: 'mini', name: 'Mini', logo: '' },
  { id: 'mitsubishi', name: 'Mitsubishi', logo: 'figma:asset/9de98cdb4aa7c35b2e8ecf5650f3bb3a6b87cdb9.png' },
  { id: 'nissan', name: 'Nissan', logo: 'figma:asset/5602fb8dd1ee4da2854779daca8cff05206350e5.png', popular: true },
  { id: 'peugeot', name: 'Peugeot', logo: 'figma:asset/73b0f0170aafd5ed8a429aa24d7327a7e6ae6150.png' },
  { id: 'porsche', name: 'Porsche', logo: 'figma:asset/2d3e04fd5d23dd4c287a2789841abd3dfeb7b5d1.png' },
  { id: 'ram', name: 'RAM', logo: '' },
  { id: 'renault', name: 'Renault', logo: 'figma:asset/921945439e162eb1664f600474a88bed59f1d515.png', popular: true },
  { id: 'seat', name: 'Seat', logo: '' },
  { id: 'smart', name: 'Smart', logo: '' },
  { id: 'subaru', name: 'Subaru', logo: 'figma:asset/a311a42ce64c2b143092a9d1c037773fa1c29acc.png' },
  { id: 'suzuki', name: 'Suzuki', logo: 'figma:asset/2210eeb7a851db726099ae589c70064532817fec.png' },
  { id: 'tesla', name: 'Tesla', logo: '' },
  { id: 'toyota', name: 'Toyota', logo: 'figma:asset/2d3911414a5edcad409dfcf18475577cba6ccbc3.png', popular: true },
  { id: 'troller', name: 'Troller', logo: '' },
  { id: 'volkswagen', name: 'Volkswagen', logo: 'figma:asset/c0762b14f96b81db88b13ecd00be7ef50ab60ca3.png', popular: true },
  { id: 'volvo', name: 'Volvo', logo: 'figma:asset/5dbaf7a440021188e77370648fc8a43d03081f31.png' },
];

// Modelos por marca (principais modelos de cada marca popular)
export const MODELS_BY_BRAND: Record<string, string[]> = {
  volkswagen: ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Nivus', 'Saveiro', 'Voyage', 'Up!', 'Jetta', 'Tiguan', 'Amarok', 'Fox', 'Golf', 'Passat', 'Fusca'],
  chevrolet: ['Onix', 'Tracker', 'S10', 'Spin', 'Montana', 'Cruze', 'Equinox', 'Trailblazer', 'Prisma', 'Cobalt', 'Celta', 'Agile', 'Classic', 'Corsa', 'Astra'],
  fiat: ['Argo', 'Mobi', 'Toro', 'Strada', 'Cronos', 'Pulse', 'Fastback', 'Uno', 'Palio', 'Siena', 'Doblo', 'Ducato', 'Punto', 'Linea', '500'],
  honda: ['Civic', 'City', 'HR-V', 'CR-V', 'Fit', 'WR-V', 'Accord', 'Accord Hybrid', 'Civic Type R'],
  toyota: ['Corolla', 'Hilux', 'SW4', 'Yaris', 'Corolla Cross', 'RAV4', 'Camry', 'Etios', 'Prius', 'Land Cruiser'],
  ford: ['Ranger', 'Territory', 'Bronco Sport', 'Maverick', 'Ka', 'EcoSport', 'Focus', 'Fusion', 'Edge', 'Fiesta'],
  hyundai: ['HB20', 'Creta', 'Tucson', 'ix35', 'Santa Fe', 'Elantra', 'Azera', 'HB20S', 'i30', 'Veloster'],
  renault: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Kardian', 'Megane', 'Fluence', 'Clio'],
  nissan: ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Livina', 'X-Trail', 'Leaf', 'GT-R', 'Altima'],
  jeep: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee', 'Cherokee'],
  peugeot: ['208', '2008', '3008', '5008', 'Partner', 'Expert', '308', '408', '508'],
  bmw: ['X1', 'X3', 'X5', 'X6', 'Série 1', 'Série 3', 'Série 5', 'Série 7', 'Z4', 'i3', 'i8'],
  'mercedes-benz': ['Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'CLA', 'Sprinter'],
  audi: ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron'],
  kia: ['Sportage', 'Sorento', 'Seltos', 'Stonic', 'Picanto', 'Cerato', 'Soul', 'Carnival'],
  mitsubishi: ['L200', 'Eclipse Cross', 'Outlander', 'ASX', 'Pajero', 'Lancer'],
  citroen: ['C3', 'C4 Cactus', 'Aircross', 'Jumper', 'Berlingo'],
  'caoa-chery': ['Tiggo 5x', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6'],
  volvo: ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'],
  porsche: ['Cayenne', 'Macan', '911', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster'],
  ram: ['1500', '2500', '3500', 'Rampage'],
  'land-rover': ['Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar', 'Discovery', 'Discovery Sport', 'Defender'],
  mini: ['Cooper', 'Cooper S', 'Countryman', 'Clubman', 'Cooper SE'],
  byd: ['Yuan Pro', 'Song Pro', 'Dolphin', 'Seal', 'Han', 'Tang'],
  tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  subaru: ['Outback', 'Forester', 'XV', 'Impreza', 'WRX', 'Legacy'],
  suzuki: ['Vitara', 'S-Cross', 'Jimny', 'Swift', 'Baleno'],
  mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-30', 'CX-5', 'CX-9', 'MX-5'],
  troller: ['T4', 'TX4'],
  dodge: ['Durango', 'Journey', 'Challenger', 'Charger', 'Ram 700'],
  lexus: ['UX', 'NX', 'RX', 'ES', 'IS', 'LS', 'LC'],
  jaguar: ['E-Pace', 'F-Pace', 'I-Pace', 'XE', 'XF', 'F-Type'],
  infiniti: ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  jac: ['J2', 'J3', 'J5', 'J6', 'T40', 'T50', 'T60', 'T8'],
  'great-wall': ['Haval H6', 'Poer'],
  seat: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
  lifan: ['530', '620', 'X60'],
  mg: ['MG5', 'MG6', 'HS', 'ZS', 'RX5'],
  smart: ['Fortwo', 'Forfour'],
  ferrari: ['12Cilindri', '296', '348', '355', '360', '456', '458', '488', '550', '575M', '612', '812', 'California', 'F12', 'F430', 'F458', 'F599', 'F8', 'FF', 'GTC4', 'Portofino', 'Purosangue', 'Roma', 'SF'],
};

// Função para obter modelos de uma marca
export function getModelsByBrand(brandId: string): string[] {
  return MODELS_BY_BRAND[brandId] || [];
}

// Função para buscar marcas
export function searchBrands(query: string): Brand[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return ALL_BRANDS;
  
  return ALL_BRANDS.filter(brand => 
    brand.name.toLowerCase().includes(lowerQuery)
  );
}