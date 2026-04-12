import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Vehicle } from '../../../types';

export function useVehicles(userId: string | null) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Carregar veículos do localStorage quando o usuário logar
  useEffect(() => {
    if (!userId) {
      setVehicles([]);
      setSelectedVehicleId(null);
      return;
    }

    try {
      const savedVehicles = localStorage.getItem(`vehicles_${userId}`);
      
      if (savedVehicles) {
        const parsedVehicles = JSON.parse(savedVehicles);
        
        // Validar dados dos veículos
        const validVehicles = parsedVehicles.filter((v: any) => 
          v && v.id && v.brand && v.model && v.year && v.plate && typeof v.currentKm === 'number'
        );
        
        if (validVehicles.length !== parsedVehicles.length) {
          console.warn('Alguns veículos com dados inválidos foram filtrados');
          localStorage.setItem(`vehicles_${userId}`, JSON.stringify(validVehicles));
        }
        
        setVehicles(validVehicles);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      localStorage.removeItem(`vehicles_${userId}`);
    }
  }, [userId]);

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId), 
    [vehicles, selectedVehicleId]
  );

  const handleVehicleRegistration = useCallback((vehicleData: Omit<Vehicle, 'id' | 'currentKm'> & { currentKm: number }) => {
    if (!userId) return null;
    
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString()
    };
    
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updatedVehicles));
    
    // Marcar primeiro acesso
    localStorage.setItem(`firstAccess_${userId}_${newVehicle.id}`, 'true');
    
    return newVehicle;
  }, [vehicles, userId]);

  const handleVehicleSelection = useCallback((vehicleId: string) => {
    if (!userId) return;
    
    setSelectedVehicleId(vehicleId);
    localStorage.setItem(`selectedVehicleId_${userId}`, vehicleId);
  }, [userId]);

  const handleVehicleDelete = useCallback((vehicleId: string) => {
    if (!userId) return;
    
    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
    setVehicles(updatedVehicles);
    
    // Limpar dados do veículo deletado
    localStorage.removeItem(`maintenanceItems_${userId}_${vehicleId}`);
    localStorage.removeItem(`maintenanceHistory_${userId}_${vehicleId}`);
    localStorage.removeItem(`lastKmUpdate_${userId}_${vehicleId}`);
    localStorage.removeItem(`firstAccess_${userId}_${vehicleId}`);
    
    if (updatedVehicles.length === 0) {
      localStorage.removeItem(`vehicles_${userId}`);
      localStorage.removeItem(`selectedVehicleId_${userId}`);
      setSelectedVehicleId(null);
    } else {
      localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updatedVehicles));
      
      if (selectedVehicleId === vehicleId) {
        setSelectedVehicleId(null);
        localStorage.removeItem(`selectedVehicleId_${userId}`);
      }
    }
    
    return updatedVehicles.length === 0;
  }, [vehicles, selectedVehicleId, userId]);

  const handleKmUpdate = useCallback((vehicleId: string, newKm: number) => {
    if (!userId) return;
    
    const updatedVehicles = vehicles.map(v => 
      v.id === vehicleId ? { ...v, currentKm: newKm } : v
    );
    
    setVehicles(updatedVehicles);
    localStorage.setItem(`vehicles_${userId}`, JSON.stringify(updatedVehicles));
    localStorage.setItem(`lastKmUpdate_${userId}_${vehicleId}`, new Date().toDateString());
  }, [vehicles, userId]);

  const checkFirstAccess = useCallback((vehicleId: string): boolean => {
    if (!userId) return false;
    const isFirst = localStorage.getItem(`firstAccess_${userId}_${vehicleId}`) === 'true';
    if (isFirst) {
      localStorage.removeItem(`firstAccess_${userId}_${vehicleId}`);
    }
    return isFirst;
  }, [userId]);

  const shouldShowKmUpdate = useCallback((vehicleId: string): boolean => {
    if (!userId) return false;
    const lastUpdate = localStorage.getItem(`lastKmUpdate_${userId}_${vehicleId}`);
    const today = new Date().toDateString();
    return lastUpdate !== today;
  }, [userId]);

  return {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    handleVehicleRegistration,
    handleVehicleSelection,
    handleVehicleDelete,
    handleKmUpdate,
    checkFirstAccess,
    shouldShowKmUpdate,
    hasVehicles: vehicles.length > 0,
  };
}