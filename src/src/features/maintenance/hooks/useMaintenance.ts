import { useState, useCallback } from 'react';
import type { MaintenanceItem, MaintenanceRecord } from '../../../types';
import { isValidDate, serializeDate, deserializeDate } from '../../../utils/date';
import { normalizeCost, validateAndCleanData } from '../../../utils/validation';

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

  const loadVehicleData = useCallback((currentVehicleId: string, currentKm: number) => {
    if (!userId || !currentVehicleId) return;
    
    try {
      const itemsKey = `maintenanceItems_${userId}_${currentVehicleId}`;
      const historyKey = `maintenanceHistory_${userId}_${currentVehicleId}`;
      
      const savedItems = localStorage.getItem(itemsKey);
      const savedHistory = localStorage.getItem(historyKey);
      
      let processedItems: MaintenanceItem[] = [];
      let processedHistory: MaintenanceRecord[] = [];
      
      // Process items
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems);
          const cleanedItems = validateAndCleanData(parsedItems);
          
          const validatedItems = cleanedItems.map((item: any) => {
            try {
              const lastMaintenanceDate = item.lastMaintenanceDate 
                ? deserializeDate(item.lastMaintenanceDate) 
                : new Date();
              
              const alertDate = item.alertDate 
                ? deserializeDate(item.alertDate) 
                : undefined;
              
              return {
                ...item,
                id: item.id || Date.now().toString(),
                name: item.name || 'Item sem nome',
                type: item.type || 'parts',
                kmBase: typeof item.kmBase === 'number' ? item.kmBase : 0,
                alertKm: typeof item.alertKm === 'number' ? item.alertKm : undefined,
                alertDate,
                lastMaintenanceDate,
                cost: normalizeCost(item.cost),
                notes: typeof item.notes === 'string' ? item.notes : undefined,
                status: 'ok' as const,
                progress: 0,
                dateProgress: 0
              };
            } catch (error) {
              console.warn('Erro ao validar item:', error);
              return null;
            }
          }).filter(Boolean);
          
          processedItems = validatedItems.map(item => 
            calculateMaintenanceStatus(item, currentKm)
          );
        } catch (error) {
          console.error('Erro ao carregar itens:', error);
          localStorage.removeItem(itemsKey);
        }
      }
      
      // Process history
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          const cleanedHistory = validateAndCleanData(parsedHistory);
          
          processedHistory = cleanedHistory.map((record: any) => {
            try {
              const date = record.date 
                ? deserializeDate(record.date) 
                : new Date();
              
              return {
                ...record,
                id: record.id || Date.now().toString(),
                itemId: record.itemId || 'unknown',
                itemName: record.itemName || 'Item sem nome',
                km: typeof record.km === 'number' ? record.km : 0,
                date,
                notes: typeof record.notes === 'string' ? record.notes : undefined,
                cost: normalizeCost(record.cost)
              };
            } catch (error) {
              console.warn('Erro ao validar registro:', error);
              return null;
            }
          }).filter(Boolean);
        } catch (error) {
          console.error('Erro ao carregar histórico:', error);
          localStorage.removeItem(historyKey);
        }
      }
      
      setMaintenanceItems(processedItems);
      setMaintenanceHistory(processedHistory);
      
    } catch (error) {
      console.error('Erro crítico ao carregar dados:', error);
      setMaintenanceItems([]);
      setMaintenanceHistory([]);
    }
  }, [userId, calculateMaintenanceStatus]);

  const saveVehicleData = useCallback((currentVehicleId: string, items?: MaintenanceItem[], history?: MaintenanceRecord[]) => {
    if (!userId || !currentVehicleId) return;
    
    try {
      const itemsToSave = items || maintenanceItems;
      const historyToSave = history || maintenanceHistory;
      
      const validItems = itemsToSave.filter(item => 
        item && item.id && item.name && typeof item.kmBase === 'number'
      );
      
      const serializedItems = validItems.map(item => ({
        ...item,
        lastMaintenanceDate: item.lastMaintenanceDate ? serializeDate(item.lastMaintenanceDate) : '',
        alertDate: item.alertDate ? serializeDate(item.alertDate) : undefined
      }));
      
      const validHistory = historyToSave.filter(record => 
        record && record.id && record.itemName && typeof record.km === 'number'
      );
      
      const serializedHistory = validHistory.map(record => ({
        ...record,
        date: record.date ? serializeDate(record.date) : ''
      }));
      
      localStorage.setItem(`maintenanceItems_${userId}_${currentVehicleId}`, JSON.stringify(serializedItems));
      localStorage.setItem(`maintenanceHistory_${userId}_${currentVehicleId}`, JSON.stringify(serializedHistory));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, [maintenanceItems, maintenanceHistory, userId]);

  const updateMaintenanceStatuses = useCallback((newKm: number) => {
    setMaintenanceItems(items => 
      items.map(item => calculateMaintenanceStatus(item, newKm))
    );
  }, [calculateMaintenanceStatus]);

  const handleAddMaintenanceItem = useCallback((
    itemData: Omit<MaintenanceItem, 'id' | 'status' | 'progress' | 'dateProgress'>, 
    currentKm: number
  ) => {
    const itemId = Date.now().toString();
    const maintenanceDate = deserializeDate(itemData.lastMaintenanceDate);
    
    const typeLabel = itemData.type === 'service' ? 'Serviço' : 'Peça';
    const actionLabel = itemData.type === 'service' ? 'adicionado' : 'adicionada';
    
    let detailedNotes = `${typeLabel} ${actionLabel}: ${itemData.name}`;
    detailedNotes += `\n\n• Última manutenção: ${maintenanceDate.toLocaleDateString('pt-BR')} aos ${itemData.kmBase.toLocaleString('pt-BR')} km`;
    
    if (itemData.cost && itemData.cost > 0) {
      detailedNotes += `\n\n• Custo estimado: R$ ${itemData.cost.toFixed(2).replace('.', ',')}`;
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
    
    const historyRecord: MaintenanceRecord = {
      id: itemId + '_history',
      itemId: (itemData.alertKm || itemData.alertDate) ? itemId : 'no-alert',
      itemName: itemData.name,
      date: new Date(),
      km: itemData.kmBase,
      notes: detailedNotes,
      cost: normalizeCost(itemData.cost)
    };

    const updatedHistory = [historyRecord, ...maintenanceHistory];
    let updatedItems = maintenanceItems;
    
    if (itemData.alertKm || itemData.alertDate) {
      const newItem: MaintenanceItem = {
        ...itemData,
        id: itemId,
        lastMaintenanceDate: maintenanceDate,
        alertDate: itemData.alertDate ? deserializeDate(itemData.alertDate) : undefined,
        cost: normalizeCost(itemData.cost),
        status: 'ok',
        progress: 0,
        dateProgress: 0
      };
      
      const calculatedItem = calculateMaintenanceStatus(newItem, currentKm);
      updatedItems = [calculatedItem, ...maintenanceItems];
      setMaintenanceItems(updatedItems);
    }
    
    setMaintenanceHistory(updatedHistory);
    
    return { updatedItems, updatedHistory };
  }, [maintenanceItems, maintenanceHistory, calculateMaintenanceStatus]);

  const handleRecordMaintenance = useCallback((
    recordData: Omit<MaintenanceRecord, 'id'> & { nextAlertDate?: Date; shouldAddToPanel?: boolean },
    currentKm: number
  ) => {
    const maintenanceDate = deserializeDate(recordData.date);
    
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
    
    if (recordData.cost && recordData.cost > 0) {
      detailedNotes += `\n\n• Custo da manutenção: R$ ${recordData.cost.toFixed(2).replace('.', ',')}`;
    }
    
    if (recordData.notes) {
      detailedNotes += `\n\n• Observações: ${recordData.notes}`;
    }
    
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      itemId: recordData.itemId,
      itemName: recordData.itemName,
      date: new Date(),
      km: recordData.km,
      notes: detailedNotes,
      cost: normalizeCost(recordData.cost)
    };

    const updatedHistory = [newRecord, ...maintenanceHistory];
    let updatedItems = maintenanceItems;
    
    if (recordData.shouldAddToPanel !== false) {
      updatedItems = maintenanceItems.map(item => {
        if (item.id === recordData.itemId) {
          const updatedItem = {
            ...item,
            kmBase: recordData.km,
            lastMaintenanceDate: maintenanceDate,
            alertDate: recordData.nextAlertDate || item.alertDate,
            cost: recordData.cost !== undefined ? normalizeCost(recordData.cost) : item.cost
          };
          return calculateMaintenanceStatus(updatedItem, currentKm);
        }
        return item;
      });
      
      const updatedItemIndex = updatedItems.findIndex(item => item.id === recordData.itemId);
      if (updatedItemIndex > -1) {
        const updatedItem = updatedItems[updatedItemIndex];
        updatedItems = [updatedItem, ...updatedItems.filter((_, index) => index !== updatedItemIndex)];
      }
    } else {
      updatedItems = maintenanceItems.filter(item => item.id !== recordData.itemId);
    }
    
    setMaintenanceHistory(updatedHistory);
    setMaintenanceItems(updatedItems);
    
    return { updatedItems, updatedHistory };
  }, [maintenanceItems, maintenanceHistory, calculateMaintenanceStatus]);

  const handleRemoveMaintenanceItems = useCallback((itemIds: string[]) => {
    const updatedItems = maintenanceItems.filter(item => !itemIds.includes(item.id));
    setMaintenanceItems(updatedItems);
    return updatedItems;
  }, [maintenanceItems]);

  const handleRemoveHistoryRecords = useCallback((recordIds: string[]) => {
    const updatedHistory = maintenanceHistory.filter(record => !recordIds.includes(record.id));
    setMaintenanceHistory(updatedHistory);
    return updatedHistory;
  }, [maintenanceHistory]);

  return {
    maintenanceItems,
    maintenanceHistory,
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