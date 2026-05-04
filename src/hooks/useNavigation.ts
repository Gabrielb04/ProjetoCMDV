import { useState, useCallback } from 'react';

export type Screen = 
  | 'vehicle-selection' 
  | 'registration' 
  | 'dashboard' 
  | 'add-item' 
  | 'record-maintenance' 
  | 'history' 
  | 'update-km';

export function useNavigation() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('vehicle-selection');

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  const goToDashboard = useCallback(() => {
    setCurrentScreen('dashboard');
  }, []);

  const goToVehicleSelection = useCallback(() => {
    setCurrentScreen('vehicle-selection');
  }, []);

  const goToRegistration = useCallback(() => {
    setCurrentScreen('registration');
  }, []);

  const goToAddItem = useCallback(() => {
    setCurrentScreen('add-item');
  }, []);

  const goToRecordMaintenance = useCallback(() => {
    setCurrentScreen('record-maintenance');
  }, []);

  const goToHistory = useCallback(() => {
    setCurrentScreen('history');
  }, []);

  const goToUpdateKm = useCallback(() => {
    setCurrentScreen('update-km');
  }, []);

  return {
    currentScreen,
    navigateTo,
    goToDashboard,
    goToVehicleSelection,
    goToRegistration,
    goToAddItem,
    goToRecordMaintenance,
    goToHistory,
    goToUpdateKm,
  };
}