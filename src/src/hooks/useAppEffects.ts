import { useEffect } from 'react';

interface UseAppEffectsProps {
  auth: {
    currentUser: any;
  };
  vehicles: {
    selectedVehicleId: string | null;
    selectedVehicle: any;
    hasVehicles: boolean;
  };
  maintenance: {
    loadVehicleData: (id: string, km: number) => void;
  };
  navigation: {
    currentScreen: string;
    navigateTo: (screen: string) => void;
  };
}

/**
 * Hook que centraliza todos os efeitos colaterais da aplicação
 * Mantém a lógica de sincronização e inicialização separada
 */
export function useAppEffects({ auth, vehicles, maintenance, navigation }: UseAppEffectsProps) {
  // Configurar idioma e metadata do documento
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (!htmlElement.lang || htmlElement.lang === 'en') {
      htmlElement.lang = 'pt-BR';
    }
    
    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`) || 
                   document.querySelector(`meta[http-equiv="${name}"]`);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (name === 'Content-Language') {
          metaTag.setAttribute('http-equiv', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    };
    
    updateMetaTag('Content-Language', 'pt-BR');
    updateMetaTag('language', 'Portuguese');
    
    if (!document.title || document.title === 'Vite + React + TS' || document.title.includes('React App')) {
      document.title = 'Carteira Digital de Manutenção Veicular';
    }
  }, []);

  // Determinar tela inicial baseado em dados do usuário
  useEffect(() => {
    if (!auth.currentUser) return;

    if (!vehicles.hasVehicles) {
      navigation.navigateTo('registration');
    } else if (!vehicles.selectedVehicleId && navigation.currentScreen !== 'registration') {
      navigation.navigateTo('vehicle-selection');
    }
  }, [auth.currentUser, vehicles.hasVehicles, vehicles.selectedVehicleId]);

  // Carregar dados do veículo quando selecionado
  useEffect(() => {
    if (vehicles.selectedVehicleId && vehicles.selectedVehicle) {
      maintenance.loadVehicleData(vehicles.selectedVehicleId, vehicles.selectedVehicle.currentKm);
    }
  }, [vehicles.selectedVehicleId]);
}
