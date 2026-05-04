import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { ALL_BRANDS, searchBrands } from '../data/vehicleData';

// Importar as imagens dos logos
import volkswagenLogo from 'figma:asset/c0762b14f96b81db88b13ecd00be7ef50ab60ca3.png';
import chevroletLogo from 'figma:asset/3abf4724dd274fac4c34328a760e9c270b5dbc27.png';
import fiatLogo from 'figma:asset/05e78c6e98897898bc5ddf4f4f471a6be40ee5bc.png';
import hondaLogo from 'figma:asset/96081528d2d03aa26c04433aadb0e49340912e6f.png';
import toyotaLogo from 'figma:asset/2d3911414a5edcad409dfcf18475577cba6ccbc3.png';
import fordLogo from 'figma:asset/0d381dac51bffa6e971cbf819e1f3c12b6eac996.png';
import hyundaiLogo from 'figma:asset/114ff71236490e77dbd54e8f27db75fb92b69188.png';
import renaultLogo from 'figma:asset/921945439e162eb1664f600474a88bed59f1d515.png';
import nissanLogo from 'figma:asset/5602fb8dd1ee4da2854779daca8cff05206350e5.png';
import peugeotLogo from 'figma:asset/73b0f0170aafd5ed8a429aa24d7327a7e6ae6150.png';
import jeepLogo from 'figma:asset/9f6026f4fc05ba41b326a9885935818a61329b0b.png';
import citroenLogo from 'figma:asset/67ac8574683f26978321ff21da290fe4a74942bd.png';
import audiLogo from 'figma:asset/e91613a915fc64c2290cd5dadfacd276dd0320c8.png';
import bmwLogo from 'figma:asset/36cf619177f6b8edee85f5c273ea8024e9bee4d7.png';
import bydLogo from 'figma:asset/fbc33347af3002e211a520ca903829c44efd5d86.png';
import volvoLogo from 'figma:asset/5dbaf7a440021188e77370648fc8a43d03081f31.png';
import suzukiLogo from 'figma:asset/2210eeb7a851db726099ae589c70064532817fec.png';
import subaruLogo from 'figma:asset/a311a42ce64c2b143092a9d1c037773fa1c29acc.png';
import kiaLogo from 'figma:asset/360eef4afb55329b58ef5cb6fa6541335b3eefe3.png';
import landRoverLogo from 'figma:asset/8cf576e61666fc28d4227f9b61bd1e1741ee4f52.png';
import jaguarLogo from 'figma:asset/9ddf2339d2c1bb23732fb44a8aaf2b96767e7942.png';
import mitsubishiLogo from 'figma:asset/9de98cdb4aa7c35b2e8ecf5650f3bb3a6b87cdb9.png';
import mercedesLogo from 'figma:asset/919a1c3e8bee25454ad40852f662d4f301d55134.png';
import porscheLogo from 'figma:asset/2d3e04fd5d23dd4c287a2789841abd3dfeb7b5d1.png';
import ferrariLogo from 'figma:asset/976abfba0fe5ccfa000a2824a6f9aac88b052811.png';

// Mapa de logos por ID da marca
const BRAND_LOGOS: Record<string, string> = {
  'volkswagen': volkswagenLogo,
  'chevrolet': chevroletLogo,
  'fiat': fiatLogo,
  'honda': hondaLogo,
  'toyota': toyotaLogo,
  'ford': fordLogo,
  'hyundai': hyundaiLogo,
  'renault': renaultLogo,
  'nissan': nissanLogo,
  'peugeot': peugeotLogo,
  'jeep': jeepLogo,
  'citroen': citroenLogo,
  'audi': audiLogo,
  'bmw': bmwLogo,
  'byd': bydLogo,
  'volvo': volvoLogo,
  'suzuki': suzukiLogo,
  'subaru': subaruLogo,
  'kia': kiaLogo,
  'land-rover': landRoverLogo,
  'jaguar': jaguarLogo,
  'mitsubishi': mitsubishiLogo,
  'mercedes-benz': mercedesLogo,
  'porsche': porscheLogo,
  'ferrari': ferrariLogo,
};

interface AllBrandsListProps {
  onSelectBrand: (brandId: string, brandName: string, logo: string) => void;
  onBack: () => void;
}

export function AllBrandsList({ onSelectBrand, onBack }: AllBrandsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBrands = searchBrands(searchQuery);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Marcas</h1>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Digite a marca desejada"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de marcas */}
      <div className="flex-1 overflow-y-auto">
        {filteredBrands.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma marca encontrada
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredBrands.map((brand) => {
              const logoSrc = BRAND_LOGOS[brand.id];
              
              return (
                <button
                  key={brand.id}
                  onClick={() => onSelectBrand(brand.id, brand.name, brand.logo || '')}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                >
                  {/* Logo da marca */}
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border flex items-center justify-center">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={brand.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-sm font-medium">{brand.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}