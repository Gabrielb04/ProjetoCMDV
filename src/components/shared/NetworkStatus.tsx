import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function NetworkStatus() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-lg">
      <div className="flex items-center gap-2 text-sm">
        <WifiOff className="h-4 w-4 shrink-0" />
        <span>Você está offline. A leitura de dados já carregados continua, mas novas alterações precisam de conexão.</span>
      </div>
    </div>
  );
}
