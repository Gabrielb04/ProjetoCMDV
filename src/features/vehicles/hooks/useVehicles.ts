import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Vehicle } from '../../../types';
import { vehicleService } from '../../../services/vehicleService';

export function useVehicles(userId: string | null) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    if (!userId) {
      setVehicles([]);
      setSelectedVehicleId(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setVehicleError(null);

    try {
      const loadedVehicles = await vehicleService.list(userId);
      setVehicles(loadedVehicles);

      const savedSelectedVehicleId = localStorage.getItem(`selectedVehicleId_${userId}`);
      const savedVehicleStillExists = loadedVehicles.some((vehicle) => vehicle.id === savedSelectedVehicleId);

      if (savedSelectedVehicleId && savedVehicleStillExists) {
        setSelectedVehicleId(savedSelectedVehicleId);
      } else {
        localStorage.removeItem(`selectedVehicleId_${userId}`);
        setSelectedVehicleId(null);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setVehicles([]);
      setSelectedVehicleId(null);
      setVehicleError('Não foi possível carregar seus veículos. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const selectedVehicle = useMemo(() =>
    vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId]
  );

  const handleVehicleRegistration = useCallback(async (
    vehicleData: Omit<Vehicle, 'id' | 'currentKm'> & { currentKm: number }
  ): Promise<Vehicle | null> => {
    if (!userId) return null;

    setVehicleError(null);

    try {
      const newVehicle = await vehicleService.create(userId, vehicleData);
      setVehicles((currentVehicles) => [...currentVehicles, newVehicle]);

      // Mantido localmente apenas para controlar a primeira navegação após cadastro.
      localStorage.setItem(`firstAccess_${userId}_${newVehicle.id}`, 'true');

      return newVehicle;
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      setVehicleError('Não foi possível cadastrar o veículo. Tente novamente.');
      return null;
    }
  }, [userId]);

  const handleVehicleSelection = useCallback((vehicleId: string) => {
    if (!userId) return;

    setSelectedVehicleId(vehicleId);
    localStorage.setItem(`selectedVehicleId_${userId}`, vehicleId);
  }, [userId]);

  const handleVehicleDelete = useCallback(async (vehicleId: string): Promise<boolean> => {
    if (!userId) return false;

    setVehicleError(null);

    try {
      await vehicleService.remove(vehicleId);

      const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== vehicleId);
      setVehicles(updatedVehicles);

      // Dados de manutenção ainda serão migrados na Fase 4. Por enquanto, limpamos o cache legado local.
      localStorage.removeItem(`maintenanceItems_${userId}_${vehicleId}`);
      localStorage.removeItem(`maintenanceHistory_${userId}_${vehicleId}`);
      localStorage.removeItem(`lastKmUpdate_${userId}_${vehicleId}`);
      localStorage.removeItem(`firstAccess_${userId}_${vehicleId}`);

      if (updatedVehicles.length === 0) {
        localStorage.removeItem(`selectedVehicleId_${userId}`);
        setSelectedVehicleId(null);
        return true;
      }

      if (selectedVehicleId === vehicleId) {
        localStorage.removeItem(`selectedVehicleId_${userId}`);
        setSelectedVehicleId(null);
      }

      return false;
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      setVehicleError('Não foi possível excluir o veículo. Tente novamente.');
      return false;
    }
  }, [vehicles, selectedVehicleId, userId]);

  const handleKmUpdate = useCallback(async (vehicleId: string, newKm: number): Promise<void> => {
    if (!userId) return;

    setVehicleError(null);

    try {
      await vehicleService.updateKm(vehicleId, newKm);

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle.id === vehicleId ? { ...vehicle, currentKm: newKm } : vehicle
        )
      );

      localStorage.setItem(`lastKmUpdate_${userId}_${vehicleId}`, new Date().toDateString());
    } catch (error) {
      console.error('Erro ao atualizar quilometragem:', error);
      setVehicleError('Não foi possível atualizar a quilometragem. Tente novamente.');
      throw error;
    }
  }, [userId]);

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
    isLoading,
    vehicleError,
    loadVehicles,
    handleVehicleRegistration,
    handleVehicleSelection,
    handleVehicleDelete,
    handleKmUpdate,
    checkFirstAccess,
    shouldShowKmUpdate,
    hasVehicles: vehicles.length > 0,
  };
}
