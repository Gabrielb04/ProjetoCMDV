import { useState, useCallback } from 'react';
import type { MaintenanceItem, MaintenanceRecord } from '../../../types';
import { isValidDate, deserializeDate } from '../../../utils/date';
import { normalizeCost } from '../../../utils/validation';
import { maintenanceService } from '../../../services/maintenanceService';

export function useMaintenance(userId: string | null, vehicleId: string | null) {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceRecord[]>([]);

  const calculateMaintenanceStatus = useCallback((item: MaintenanceItem, currentKm: number): MaintenanceItem => {
    let status: 'ok' | 'warning' | 'overdue' | 'no-alert' | 'date-warning' | 'date-overdue' = 'no-alert';
    let progress = 0;
    let dateProgress = 0;
    let kmStatus: 'ok' | 'warning' | 'overdue' | null = null;
    let dateStatus: 'ok' | 'date-warning' | 'date-overdue' | null = null;

    // Calcular status por quilometragem
    if (item.alertKm) {
      progress = (currentKm - item.kmBase) / item.alertKm;
      
      if (progress >= 1.0) {
        kmStatus = 'overdue';
      } else if (progress >= 0.8) {
        kmStatus = 'warning';
      } else {
        kmStatus = 'ok';
      }
    }

    // Calcular status por data
    if (item.alertDate && isValidDate(item.alertDate)) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const alertDate = new Date(item.alertDate);
        alertDate.setHours(0, 0, 0, 0);
        
        const daysUntilAlert = Math.ceil((alertDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const totalObservationDays = 60;
        
        if (daysUntilAlert <= 0) {
          dateProgress = 1.0;
          dateStatus = 'date-overdue';
        } else if (daysUntilAlert <= 7) {
          dateProgress = Math.min(0.85 + (7 - daysUntilAlert) * 0.015, 0.95);
          dateStatus = 'date-warning';
        } else if (daysUntilAlert <= 30) {
          dateProgress = Math.min(0.70 + (30 - daysUntilAlert) * 0.0065, 0.85);
          dateStatus = 'ok';
        } else if (daysUntilAlert <= totalObservationDays) {
          dateProgress = Math.min((totalObservationDays - daysUntilAlert) / totalObservationDays * 0.7, 0.7);
          dateStatus = 'ok';
        } else {
          dateProgress = 0;
          dateStatus = 'ok';
        }
      } catch (error) {
        console.warn('Erro ao calcular status por data:', error);
        dateStatus = 'ok';
        dateProgress = 0;
      }
    }

    // Determinar status final
    if (kmStatus === 'overdue' || dateStatus === 'date-overdue') {
      status = kmStatus === 'overdue' ? 'overdue' : 'date-overdue';
    } else if (kmStatus === 'warning' || dateStatus === 'date-warning') {
      status = kmStatus === 'warning' ? 'warning' : 'date-warning';
    } else if (kmStatus === 'ok' || dateStatus === 'ok') {
      status = 'ok';
    } else {
      status = 'no-alert';
    }

    return { 
      ...item, 
      status, 
      progress, 
      dateProgress,
      alertDate: item.alertDate,
      lastMaintenanceDate: item.lastMaintenanceDate
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVehicleData = useCallback(async (currentVehicleId: string, currentKm: number) => {
    if (!userId || !currentVehicleId) {
      setMaintenanceItems([]);
      setMaintenanceHistory([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [items, history] = await Promise.all([
        maintenanceService.listItems(userId, currentVehicleId),
        maintenanceService.listRecords(userId, currentVehicleId),
      ]);

      setMaintenanceItems(items.map(item => calculateMaintenanceStatus(item, currentKm)));
      setMaintenanceHistory(history);
    } catch (err) {
      console.error('Erro ao carregar manutenções:', err);
      setError('Não foi possível carregar as manutenções.');
      setMaintenanceItems([]);
      setMaintenanceHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, calculateMaintenanceStatus]);

  const saveVehicleData = useCallback(async () => {
    // Dados de manutenção agora são persistidos diretamente no Supabase por operação.
  }, []);

  const updateMaintenanceStatuses = useCallback((newKm: number) => {
    setMaintenanceItems(items => 
      items.map(item => calculateMaintenanceStatus(item, newKm))
    );
  }, [calculateMaintenanceStatus]);

  const handleAddMaintenanceItem = useCallback(async (
    itemData: Omit<MaintenanceItem, 'id' | 'status' | 'progress' | 'dateProgress'>, 
    currentKm: number
  ) => {
    if (!userId || !vehicleId) {
      throw new Error('Usuário ou veículo não encontrado.');
    }

    const maintenanceDate = deserializeDate(itemData.lastMaintenanceDate);
    const normalizedCost = normalizeCost(itemData.cost);
    const typeLabel = itemData.type === 'service' ? 'Serviço' : 'Peça';
    const actionLabel = itemData.type === 'service' ? 'adicionado' : 'adicionada';
    
    let detailedNotes = `${typeLabel} ${actionLabel}: ${itemData.name}`;
    detailedNotes += `\n\n• Última manutenção: ${maintenanceDate.toLocaleDateString('pt-BR')} aos ${itemData.kmBase.toLocaleString('pt-BR')} km`;
    
    if (normalizedCost && normalizedCost > 0) {
      detailedNotes += `\n\n• Custo estimado: R$ ${normalizedCost.toFixed(2).replace('.', ',')}`;
    }
    
    const alerts = [];
    if (itemData.alertKm) {
      alerts.push(`${itemData.alertKm.toLocaleString('pt-BR')} km`);
    }
    if (itemData.alertDate) {
      const alertDate = deserializeDate(itemData.alertDate);
      alerts.push(`${alertDate.toLocaleDateString('pt-BR')}`);
    }
    
    if (alerts.length > 0) {
      detailedNotes += `\n\n• Alertas configurados: ${alerts.join(' e ')}`;
    } else {
      detailedNotes += `\n\n• Alertas: Nenhum alerta configurado`;
    }
    
    if (itemData.notes && itemData.notes.trim()) {
      detailedNotes += `\n\n• Observações: ${itemData.notes.trim()}`;
    }

    try {
      setError(null);
      let updatedItems = maintenanceItems;
      let savedItem: MaintenanceItem | null = null;

      if (itemData.alertKm || itemData.alertDate) {
        savedItem = await maintenanceService.createItem(userId, vehicleId, {
          ...itemData,
          lastMaintenanceDate: maintenanceDate,
          alertDate: itemData.alertDate ? deserializeDate(itemData.alertDate) : undefined,
          cost: normalizedCost,
        });

        const calculatedItem = calculateMaintenanceStatus(savedItem, currentKm);
        updatedItems = [calculatedItem, ...maintenanceItems];
        setMaintenanceItems(updatedItems);
      }

      const savedRecord = await maintenanceService.createRecord(userId, vehicleId, {
        itemId: savedItem?.id ?? 'no-alert',
        itemName: itemData.name,
        date: maintenanceDate,
        km: itemData.kmBase,
        notes: detailedNotes,
        cost: normalizedCost,
      });

      const updatedHistory = [savedRecord, ...maintenanceHistory];
      setMaintenanceHistory(updatedHistory);

      return { updatedItems, updatedHistory };
    } catch (err) {
      console.error('Erro ao adicionar manutenção:', err);
      setError('Não foi possível adicionar a manutenção.');
      throw err;
    }
  }, [userId, vehicleId, maintenanceItems, maintenanceHistory, calculateMaintenanceStatus]);

  const handleRecordMaintenance = useCallback(async (
    recordData: Omit<MaintenanceRecord, 'id'> & { nextAlertDate?: Date; shouldAddToPanel?: boolean },
    currentKm: number
  ) => {
    if (!userId || !vehicleId) {
      throw new Error('Usuário ou veículo não encontrado.');
    }

    const maintenanceDate = deserializeDate(recordData.date);
    const normalizedCost = normalizeCost(recordData.cost);
    const correspondingItem = maintenanceItems.find(item => item.id === recordData.itemId);
    const itemType = correspondingItem?.type || 'parts';
    
    const typeLabel = itemType === 'service' ? 'Serviço' : 'Troca de peça';
    const actionLabel = itemType === 'service' ? 'realizado' : 'realizada';
    
    let detailedNotes = `${typeLabel} ${actionLabel}: ${recordData.itemName}`;
    detailedNotes += `\n\n• Data da manutenção: ${maintenanceDate.toLocaleDateString('pt-BR')}`;
    detailedNotes += `\n\n• Quilometragem: ${recordData.km.toLocaleString('pt-BR')} km`;
    
    if (correspondingItem) {
      if (recordData.shouldAddToPanel !== false) {
        const nextAlerts = [];
        
        if (correspondingItem.alertKm) {
          const nextKmAlert = recordData.km + correspondingItem.alertKm;
          nextAlerts.push(`${nextKmAlert.toLocaleString('pt-BR')} km`);
        }
        
        if (recordData.nextAlertDate) {
          nextAlerts.push(`${recordData.nextAlertDate.toLocaleDateString('pt-BR')}`);
        } else if (correspondingItem.alertDate) {
          nextAlerts.push(`${correspondingItem.alertDate.toLocaleDateString('pt-BR')}`);
        }
        
        if (nextAlerts.length > 0) {
          detailedNotes += `\n\n• Próximos alertas: ${nextAlerts.join(' e ')}`;
        }
      } else {
        detailedNotes += `\n\n• Status: Item removido do painel de manutenção (mantido apenas no histórico)`;
      }
    }
    
    if (normalizedCost && normalizedCost > 0) {
      detailedNotes += `\n\n• Custo da manutenção: R$ ${normalizedCost.toFixed(2).replace('.', ',')}`;
    }
    
    if (recordData.notes) {
      detailedNotes += `\n\n• Observações: ${recordData.notes}`;
    }

    try {
      setError(null);

      const savedRecord = await maintenanceService.createRecord(userId, vehicleId, {
        itemId: recordData.itemId,
        itemName: recordData.itemName,
        date: maintenanceDate,
        km: recordData.km,
        notes: detailedNotes,
        cost: normalizedCost,
      });

      const updatedHistory = [savedRecord, ...maintenanceHistory];
      let updatedItems = maintenanceItems;
      
      if (correspondingItem) {
        if (recordData.shouldAddToPanel !== false) {
          const savedUpdatedItem = await maintenanceService.updateItem(correspondingItem.id, {
            kmBase: recordData.km,
            lastMaintenanceDate: maintenanceDate,
            alertDate: recordData.nextAlertDate || correspondingItem.alertDate,
            cost: normalizedCost !== undefined ? normalizedCost : correspondingItem.cost,
          });

          const calculatedUpdatedItem = calculateMaintenanceStatus(savedUpdatedItem, currentKm);
          updatedItems = [
            calculatedUpdatedItem,
            ...maintenanceItems.filter(item => item.id !== correspondingItem.id),
          ];
        } else {
          await maintenanceService.removeItems([correspondingItem.id]);
          updatedItems = maintenanceItems.filter(item => item.id !== correspondingItem.id);
        }
      }
      
      setMaintenanceHistory(updatedHistory);
      setMaintenanceItems(updatedItems);
      
      return { updatedItems, updatedHistory };
    } catch (err) {
      console.error('Erro ao registrar manutenção:', err);
      setError('Não foi possível registrar a manutenção.');
      throw err;
    }
  }, [userId, vehicleId, maintenanceItems, maintenanceHistory, calculateMaintenanceStatus]);

  const handleRemoveMaintenanceItems = useCallback(async (itemIds: string[]) => {
    try {
      setError(null);
      await maintenanceService.removeItems(itemIds);
      const updatedItems = maintenanceItems.filter(item => !itemIds.includes(item.id));
      setMaintenanceItems(updatedItems);
      return updatedItems;
    } catch (err) {
      console.error('Erro ao remover itens de manutenção:', err);
      setError('Não foi possível remover os itens selecionados.');
      throw err;
    }
  }, [maintenanceItems]);

  const handleRemoveHistoryRecords = useCallback(async (recordIds: string[]) => {
    try {
      setError(null);
      await maintenanceService.removeRecords(recordIds);
      const updatedHistory = maintenanceHistory.filter(record => !recordIds.includes(record.id));
      setMaintenanceHistory(updatedHistory);
      return updatedHistory;
    } catch (err) {
      console.error('Erro ao remover registros do histórico:', err);
      setError('Não foi possível remover os registros selecionados.');
      throw err;
    }
  }, [maintenanceHistory]);

  return {
    maintenanceItems,
    maintenanceHistory,
    isLoading,
    error,
    loadVehicleData,
    saveVehicleData,
    updateMaintenanceStatuses,
    handleAddMaintenanceItem,
    handleRecordMaintenance,
    handleRemoveMaintenanceItems,
    handleRemoveHistoryRecords,
    calculateMaintenanceStatus,
  };
}