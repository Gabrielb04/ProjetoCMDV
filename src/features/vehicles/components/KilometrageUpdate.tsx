import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { Gauge } from 'lucide-react';
import type { Vehicle } from '../../../types';

interface KilometrageUpdateProps {
  vehicle: Vehicle;
  onUpdate: (newKm: number) => void | Promise<void>;
  onSkip: () => void;
}

export function KilometrageUpdate({ vehicle, onUpdate, onSkip }: KilometrageUpdateProps) {
  const [newKm, setNewKm] = useState<string>(vehicle.currentKm.toString());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kmValue = parseInt(newKm) || 0;
    
    if (!newKm.trim() || isNaN(kmValue)) {
      setError('Por favor, informe um valor válido');
      return;
    }
    
    if (kmValue < vehicle.currentKm) {
      setError('A nova quilometragem não pode ser menor que a atual');
      return;
    }
    
    onUpdate(kmValue);
  };

  const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewKm(value);
    setError('');
  };

  const kmValue = parseInt(newKm) || 0;
  const kmDifference = kmValue - vehicle.currentKm;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      {/* ── TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <Gauge className="w-4 h-4 text-primary" />
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-2">
          <h1 className="text-lg font-semibold">Atualizar Quilometragem</h1>
          <p className="text-xs text-muted-foreground">
            Mantenha a quilometragem atualizada
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-center">Quilometragem Atual</CardTitle>
            <CardDescription className="text-center text-sm">
              Informe a quilometragem atual do seu veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentKm" className="text-center block">
                  Quilometragem anterior: <span className="font-medium">{vehicle.currentKm.toLocaleString('pt-BR')} km</span>
                </Label>
                <Input
                  id="currentKm"
                  type="number"
                  min={vehicle.currentKm}
                  value={newKm}
                  onChange={handleKmChange}
                  placeholder="Digite a nova quilometragem"
                  required
                  className="text-center text-lg sm:text-xl h-12 sm:h-14"
                />
                {error && (
                  <p className="text-xs sm:text-sm text-destructive text-center">{error}</p>
                )}
                {!error && newKm && !isNaN(kmValue) && kmValue >= vehicle.currentKm && (
                  <p className="text-xs text-muted-foreground text-center">
                    {kmDifference > 0 ? (
                      <>A diferença será: <span className="font-medium text-green-600">+{kmDifference.toLocaleString('pt-BR')} km</span></>
                    ) : (
                      <span className="font-medium">Quilometragem mantida</span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full h-12"
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  {kmDifference > 0 ? 'Atualizar Quilometragem' : 'Confirmar Quilometragem'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSkip}
                  className="w-full"
                >
                  Pular por Agora
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-blue-600">💡</span>
            </div>
            <div>
              <p className="text-sm text-blue-700">
                <strong>Dica:</strong> Atualize a quilometragem regularmente para receber alertas precisos sobre manutenções preventivas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}