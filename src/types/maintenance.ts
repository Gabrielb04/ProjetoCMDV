export interface MaintenanceItem {
  id: string;
  name: string;
  type: 'parts' | 'service';
  alertKm?: number;
  alertDate?: Date;
  kmBase: number;
  lastMaintenanceDate: Date;
  status: 'ok' | 'warning' | 'overdue' | 'no-alert' | 'date-warning' | 'date-overdue';
  progress: number;
  dateProgress?: number;
  cost?: number;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  date: Date;
  km: number;
  notes?: string;
  cost?: number;
}
