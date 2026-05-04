import { Vehicle } from '../types';
import { useNavigation } from './useNavigation';

interface UseAppHandlersProps {
  auth: {
    currentUser: any;
    handleLogout: () => void | Promise<void>;
  };
  vehicles: {
    selectedVehicleId: string | null;
    selectedVehicle: Vehicle | null;
    hasVehicles: boolean;
    handleVehicleRegistration: (data: any) => Promise<Vehicle | null>;
    handleVehicleSelection: (id: string) => void;
    handleVehicleDelete: (id: string) => Promise<boolean>;
    handleKmUpdate: (id: string, km: number) => Promise<void>;
    checkFirstAccess: (id: string) => boolean;
  };
  maintenance: {
    maintenanceItems: any[];
    maintenanceHistory: any[];
    loadVehicleData: (id: string, km: number) => void | Promise<void>;
    saveVehicleData: (id?: string, items?: any[], history?: any[]) => void | Promise<void>;
    updateMaintenanceStatuses: (km: number) => void;
    handleAddMaintenanceItem: (data: any, km: number) => Promise<{ updatedItems: any[]; updatedHistory: any[] }>;
    handleRecordMaintenance: (data: any, km: number) => Promise<{ updatedItems: any[]; updatedHistory: any[] }>;
    handleRemoveMaintenanceItems: (ids: string[]) => Promise<any[]>;
    handleRemoveHistoryRecords: (ids: string[]) => Promise<any[]>;
  };
}

/**
 * Hook que centraliza todos os handlers da aplicação
 * Mantém o App.tsx focado apenas em orquestração e renderização
 */
export function useAppHandlers({ auth, vehicles, maintenance }: UseAppHandlersProps) {
  const navigation = useNavigation();

  const handleVehicleRegistration = async (vehicleData: any) => {
    const newVehicle = await vehicles.handleVehicleRegistration(vehicleData);
    if (newVehicle) {
      vehicles.handleVehicleSelection(newVehicle.id);
      await maintenance.loadVehicleData(newVehicle.id, newVehicle.currentKm);
      navigation.goToDashboard();
    }
  };

  const handleVehicleSelection = (vehicleId: string) => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    
    vehicles.handleVehicleSelection(vehicleId);
    
    const isFirstAccess = vehicles.checkFirstAccess(vehicleId);
    
    if (isFirstAccess) {
      navigation.goToDashboard();
    } else {
      // Navega diretamente para a tela de atualização de KM (tela separada)
      navigation.goToUpdateKm();
    }
  };

  const handleVehicleDelete = async (vehicleId: string) => {
    const noVehiclesLeft = await vehicles.handleVehicleDelete(vehicleId);
    
    if (noVehiclesLeft) {
      maintenance.loadVehicleData('', 0);
      navigation.goToVehicleSelection();
    }
  };

  const handleBackToVehicleSelection = () => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    navigation.goToVehicleSelection();
  };

  const handleKmUpdate = async (newKm: number) => {
    if (!vehicles.selectedVehicle) return;
    
    await vehicles.handleKmUpdate(vehicles.selectedVehicle.id, newKm);
    maintenance.updateMaintenanceStatuses(newKm);
    
    // Sempre navega de volta para o Dashboard após atualizar
    navigation.goToDashboard();
  };

  const handleKmSkip = () => {
    if (!vehicles.selectedVehicle || !auth.currentUser) return;
    
    localStorage.setItem(
      `lastKmUpdate_${auth.currentUser.id}_${vehicles.selectedVehicle.id}`,
      new Date().toDateString()
    );
    
    // Sempre navega de volta para o Dashboard após pular
    navigation.goToDashboard();
  };

  const handleAddMaintenanceItem = async (itemData: any) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || 0;
    await maintenance.handleAddMaintenanceItem(itemData, currentKm);
    navigation.goToDashboard();
  };

  const handleRecordMaintenance = async (recordData: any) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || recordData.km;
    await maintenance.handleRecordMaintenance(recordData, currentKm);
    navigation.goToDashboard();
  };

  const handleRemoveMaintenanceItems = async (itemIds: string[]) => {
    await maintenance.handleRemoveMaintenanceItems(itemIds);
  };

  const handleRemoveHistoryRecords = async (recordIds: string[]) => {
    await maintenance.handleRemoveHistoryRecords(recordIds);
  };

  const handleLogout = async () => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    
    await auth.handleLogout();
    navigation.goToVehicleSelection();
  };

  return {
    navigation,
    handleVehicleRegistration,
    handleVehicleSelection,
    handleVehicleDelete,
    handleBackToVehicleSelection,
    handleKmUpdate,
    handleKmSkip,
    handleAddMaintenanceItem,
    handleRecordMaintenance,
    handleRemoveMaintenanceItems,
    handleRemoveHistoryRecords,
    handleLogout,
  };
}