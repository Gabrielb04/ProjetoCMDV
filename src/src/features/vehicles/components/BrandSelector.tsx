import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { POPULAR_BRANDS, Brand } from '../data/vehicleData';

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

interface BrandSelectorProps {
  selectedBrand: Brand | null;
  onSelectBrand: (brandId: string, brandName: string, logo: string) => void;
  onClearBrand: () => void;
  onShowAllBrands: () => void;
}

export function BrandSelector({ selectedBrand, onSelectBrand, onClearBrand, onShowAllBrands }: BrandSelectorProps) {
  const handleBrandClick = (brand: Brand) => {
    onSelectBrand(brand.id, brand.name, brand.logo);
  };

  // Se uma marca já foi selecionada, mostra o campo com logo e botão X
  if (selectedBrand) {
    const logoSrc = BRAND_LOGOS[selectedBrand.id];
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Marca</label>
        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-input bg-background">
          {/* Logo da marca */}
          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border flex items-center justify-center">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={selectedBrand.name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                {selectedBrand.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Nome da marca */}
          <span className="flex-1 text-sm font-medium">{selectedBrand.name}</span>
          
          {/* Botão X para limpar */}
          <button
            type="button"
            onClick={onClearBrand}
            className="w-6 h-6 flex-shrink-0 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // Se nenhuma marca foi selecionada, mostra o grid de seleção
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4">Marca</h3>
        
        {/* Grid de marcas populares com imagens reais */}
        <div className="grid grid-cols-3 gap-3">
          {POPULAR_BRANDS.map((brand) => {
            const logoSrc = BRAND_LOGOS[brand.id];
            
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => handleBrandClick(brand)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border bg-card hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden bg-white">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={brand.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center leading-tight">{brand.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botão "Todas as marcas" */}
      <Button
        type="button"
        variant="ghost"
        onClick={onShowAllBrands}
        className="w-full justify-between text-primary hover:text-primary"
      >
        <span>Todas as marcas</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}