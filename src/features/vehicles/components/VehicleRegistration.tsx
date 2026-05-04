import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { Car, ArrowLeft } from 'lucide-react';
import { BrandSelector } from './BrandSelector';
import { AllBrandsList } from './AllBrandsList';
import { ModelSelector } from './ModelSelector';

interface VehicleRegistrationProps {
  onRegister: (vehicle: { brand: string; brandId: string; model: string; year: number; plate: string; currentKm: number }) => void | Promise<void>;
  onBack?: () => void;
  onLogout?: () => void;
}

export function VehicleRegistration({ onRegister, onBack, onLogout }: VehicleRegistrationProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    brandId: '',
    brandLogo: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    currentKm: 0
  });

  const [plateError, setPlateError] = useState('');

  const handleBrandSelect = (brandId: string, brandName: string, logo: string) => {
    setFormData(prev => ({ 
      ...prev, 
      brandId, 
      brand: brandName,
      brandLogo: logo,
      model: '' // Limpa o modelo ao mudar a marca
    }));
    setShowAllBrands(false);
  };

  const handleClearBrand = () => {
    setFormData(prev => ({
      ...prev,
      brandId: '',
      brand: '',
      brandLogo: '',
      model: ''
    }));
  };

  const isFormValid = () => {
    return formData.brand.trim() !== '' && 
           formData.model.trim() !== '' && 
           formData.year > 0 && 
           formData.plate.trim() !== '' && 
           formData.currentKm >= 0 &&
           !plateError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    onRegister({
      brand: formData.brand.trim(),
      brandId: formData.brandId, // Adiciona o brandId
      model: formData.model.trim(),
      year: formData.year,
      plate: formData.plate.trim(),
      currentKm: formData.currentKm
    });
  };

  // Se estiver mostrando todas as marcas, renderiza a lista completa
  if (showAllBrands) {
    return (
      <AllBrandsList
        onSelectBrand={handleBrandSelect}
        onBack={() => setShowAllBrands(false)}
      />
    );
  }

  // Cria objeto Brand para passar ao BrandSelector
  const selectedBrand = formData.brandId ? {
    id: formData.brandId,
    name: formData.brand,
    logo: formData.brandLogo
  } : null;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <Car className="w-4 h-4 text-primary" />
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-2">
          <h1 className="text-lg font-semibold">
            Adicionar Veículo
          </h1>
          <p className="text-xs text-muted-foreground">
            Preencha os dados para começar
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-4 pb-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Informações do Veículo</CardTitle>
            <CardDescription className="text-sm">
              Preencha os dados básicos do seu veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Seleção de Marca */}
              <BrandSelector
                onSelectBrand={handleBrandSelect}
                onShowAllBrands={() => setShowAllBrands(true)}
                selectedBrand={selectedBrand}
                onClearBrand={handleClearBrand}
              />

              {/* Seleção de Modelo - só aparece após selecionar a marca */}
              {formData.brandId && (
                <ModelSelector
                  brandId={formData.brandId}
                  value={formData.model}
                  onChange={(model) => setFormData(prev => ({ ...prev, model }))}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                    placeholder="Ex: 2020"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plate">Placa *</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                    placeholder="Ex: ABC-1234"
                    required
                    maxLength={8}
                    className="w-full"
                  />
                  {plateError && (
                    <p className="text-xs sm:text-sm text-destructive">{plateError}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentKm">Quilometragem Atual *</Label>
                <Input
                  id="currentKm"
                  type="number"
                  min="0"
                  value={formData.currentKm}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentKm: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 50000"
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Informe a quilometragem atual do veículo
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {onBack && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onBack}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full flex-1 order-1 sm:order-2"
                  disabled={!isFormValid()}
                >
                  <Car className="w-4 h-4 mr-2" />
                  Cadastrar Veículo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}