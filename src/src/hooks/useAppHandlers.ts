import { Vehicle } from '../types';
import { useNavigation } from './useNavigation';

interface UseAppHandlersProps {
  auth: {
    currentUser: any;
    handleLogout: () => void;
  };
  vehicles: {
    selectedVehicleId: string | null;
    selectedVehicle: Vehicle | null;
    hasVehicles: boolean;
    handleVehicleRegistration: (data: any) => Vehicle | null;
    handleVehicleSelection: (id: string) => void;
    handleVehicleDelete: (id: string) => boolean;
    handleKmUpdate: (id: string, km: number) => void;
    checkFirstAccess: (id: string) => boolean;
  };
  maintenance: {
    maintenanceItems: any[];
    maintenanceHistory: any[];
    loadVehicleData: (id: string, km: number) => void;
    saveVehicleData: (id: string, items?: any[], history?: any[]) => void;
    updateMaintenanceStatuses: (km: number) => void;
    handleAddMaintenanceItem: (data: any, km: number) => { updatedItems: any[]; updatedHistory: any[] };
    handleRecordMaintenance: (data: any, km: number) => { updatedItems: any[]; updatedHistory: any[] };
    handleRemoveMaintenanceItems: (ids: string[]) => any[];
    handleRemoveHistoryRecords: (ids: string[]) => any[];
  };
}

/**
 * Hook que centraliza todos os handlers da aplicação
 * Mantém o App.tsx focado apenas em orquestração e renderização
 */
export function useAppHandlers({ auth, vehicles, maintenance }: UseAppHandlersProps) {
  const navigation = useNavigation();

  const handleVehicleRegistration = (vehicleData: any) => {
    const newVehicle = vehicles.handleVehicleRegistration(vehicleData);
    if (newVehicle) {
      vehicles.handleVehicleSelection(newVehicle.id);
      maintenance.loadVehicleData(newVehicle.id, newVehicle.currentKm);
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

  const handleVehicleDelete = (vehicleId: string) => {
    const noVehiclesLeft = vehicles.handleVehicleDelete(vehicleId);
    
    if (noVehiclesLeft) {
      maintenance.loadVehicleData('', 0);
      navigation.goToRegistration();
    }
  };

  const handleBackToVehicleSelection = () => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    navigation.goToVehicleSelection();
  };

  const handleKmUpdate = (newKm: number) => {
    if (!vehicles.selectedVehicle) return;
    
    vehicles.handleKmUpdate(vehicles.selectedVehicle.id, newKm);
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

  const handleAddMaintenanceItem = (itemData: any) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || 0;
    const { updatedItems, updatedHistory } = maintenance.handleAddMaintenanceItem(itemData, currentKm);
    
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId, updatedItems, updatedHistory);
    }
    
    navigation.goToDashboard();
  };

  const handleRecordMaintenance = (recordData: any) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || recordData.km;
    const { updatedItems, updatedHistory } = maintenance.handleRecordMaintenance(recordData, currentKm);
    
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId, updatedItems, updatedHistory);
    }

    navigation.goToDashboard();
  };

  const handleRemoveMaintenanceItems = (itemIds: string[]) => {
    const updatedItems = maintenance.handleRemoveMaintenanceItems(itemIds);
    
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId, updatedItems, maintenance.maintenanceHistory);
    }
  };

  const handleRemoveHistoryRecords = (recordIds: string[]) => {
    const updatedHistory = maintenance.handleRemoveHistoryRecords(recordIds);
    
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId, maintenance.maintenanceItems, updatedHistory);
    }
  };

  const handleLogout = () => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    
    auth.handleLogout();
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