export type OfflineOperationType =
  | 'vehicle:create'
  | 'vehicle:update-km'
  | 'vehicle:delete'
  | 'maintenance-item:create'
  | 'maintenance-item:update'
  | 'maintenance-item:delete'
  | 'maintenance-record:create'
  | 'maintenance-record:delete';

export interface OfflineOperation {
  id: string;
  type: OfflineOperationType;
  payload: unknown;
  createdAt: string;
  attempts: number;
}

const QUEUE_KEY = 'cmdv_offline_queue_v1';

function readQueue(): OfflineOperation[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Fila offline corrompida. Limpando fila.', error);
    localStorage.removeItem(QUEUE_KEY);
    return [];
  }
}

function writeQueue(queue: OfflineOperation[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export const offlineQueue = {
  list(): OfflineOperation[] {
    return readQueue();
  },

  enqueue(type: OfflineOperationType, payload: unknown): OfflineOperation {
    const operation: OfflineOperation = {
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    writeQueue([...readQueue(), operation]);
    return operation;
  },

  remove(id: string) {
    writeQueue(readQueue().filter((operation) => operation.id !== id));
  },

  incrementAttempt(id: string) {
    writeQueue(
      readQueue().map((operation) =>
        operation.id === id
          ? { ...operation, attempts: operation.attempts + 1 }
          : operation
      )
    );
  },

  clear() {
    localStorage.removeItem(QUEUE_KEY);
  },
};
