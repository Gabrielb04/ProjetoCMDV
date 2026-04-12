// Função utilitária para normalizar custos (0 vira undefined)
export const normalizeCost = (cost: any): number | undefined => {
  if (typeof cost === 'number' && cost > 0) {
    return cost;
  }
  return undefined;
};

// Função utilitária para validar e limpar dados corrompidos
export const validateAndCleanData = (data: any[]): any[] => {
  try {
    if (!Array.isArray(data)) {
      console.warn('Dados não são um array válido, retornando array vazio');
      return [];
    }
    
    return data.filter(item => {
      if (!item || typeof item !== 'object') {
        console.warn('Item inválido filtrado:', item);
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Erro ao validar dados:', error);
    return [];
  }
};
