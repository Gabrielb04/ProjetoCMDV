import AppRouter from './src/app/AppRouter';
import { ErrorBoundary, NetworkStatus } from './src/components/shared';

/**
 * App.tsx - Componente raiz da aplicação
 * 
 * Nota: A estrutura principal está em /src/app/
 * Este arquivo é mantido na raiz por compatibilidade com o sistema
 */
export default function App() {
  return (
    <ErrorBoundary>
      <NetworkStatus />
      <AppRouter />
    </ErrorBoundary>
  );
}
