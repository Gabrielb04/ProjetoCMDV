import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../../components/ui/alert-dialog';
import { ThemeToggle } from '../../../components/shared/ThemeToggle';
import { Car, Plus, Trash2, ChevronRight, LogOut, User } from 'lucide-react';
import type { Vehicle } from '../../../types';

// Importar logos
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

interface VehicleSelectionProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicleId: string) => void;
  onAddVehicle: () => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onLogout?: () => void;
  currentUser?: { name: string; email: string };
}

export function VehicleSelection({ vehicles, onSelectVehicle, onAddVehicle, onDeleteVehicle, onLogout, currentUser }: VehicleSelectionProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleDeleteClick = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setVehicleToDelete(vehicle);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      onDeleteVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col max-w-md mx-auto relative">
      
      {/* ── TOP BAR ── */}
      <div className="bg-card border-b sticky top-0 z-30 px-4 pt-3 pb-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <Car className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Sair</span>
              </button>
            )}
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{currentUser.name}</span>
            </div>
            <p className="text-xs text-muted-foreground capitalize">{currentDate}</p>
          </div>
        )}

        <div className="mt-3">
          <h1 className="text-lg font-semibold">
            {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}!` : 'Meus Veículos'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {vehicles.length === 0 
              ? 'Adicione seu primeiro veículo' 
              : `${vehicles.length} ${vehicles.length === 1 ? 'veículo cadastrado' : 'veículos cadastrados'}`
            }
          </p>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pt-4 pb-24">
        
        {/* Vehicle Cards */}
        {vehicles.map((vehicle) => {
          const logoSrc = vehicle.brandId ? BRAND_LOGOS[vehicle.brandId] : null;
          
          return (
            <div key={vehicle.id} className="w-full">
              <Card 
                onClick={() => onSelectVehicle(vehicle.id)}
                className="hover:bg-accent/50 transition-all hover:shadow-md border cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-white rounded-full border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={vehicle.brand}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Car className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteClick(vehicle, e)}
                      className="opacity-60 hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold truncate">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Ano: {vehicle.year}</span>
                      <span>Placa: {vehicle.plate}</span>
                      <span>Km: {vehicle.currentKm.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex items-center text-xs text-primary">
                    <span>Acessar painel</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* Empty State */}
        {vehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Car className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Nenhum veículo cadastrado</p>
            <p className="text-xs text-muted-foreground mb-6">Adicione seu primeiro veículo para começar</p>
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTION BAR ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t z-30 px-4 pt-3 pb-5 safe-area-bottom">
        <button
          onClick={onAddVehicle}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-medium transition-all hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Adicionar Novo Veículo
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Veículo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o veículo{' '}
              <strong>{vehicleToDelete?.brand} {vehicleToDelete?.model}</strong>?
              <br /><br />
              Esta ação é irreversível e todos os dados de manutenção 
              associados a este veículo serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)} className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}