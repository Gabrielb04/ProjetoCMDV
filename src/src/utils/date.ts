// Função utilitária para validar se é uma data válida
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Função utilitária para criar uma data local a partir de uma string YYYY-MM-DD
export const createLocalDate = (dateString: string | Date): Date | null => {
  // Se já é um objeto Date válido, retornar ele mesmo
  if (isValidDate(dateString)) {
    return dateString;
  }
  
  // Se é null, undefined ou não é string nem objeto
  if (!dateString) {
    return null;
  }
  
  // Se não é string, tentar converter para string primeiro
  if (typeof dateString !== 'string') {
    if (dateString && typeof dateString === 'object' && dateString.toString) {
      // Tentar converter object para string (pode ser um Date serializado)
      const dateStr = dateString.toString();
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        if (year > 1900 && year < 3000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const date = new Date(year, month - 1, day);
          return isValidDate(date) ? date : null;
        }
      }
    }
    return null;
  }
  
  // Limpar a string de espaços em branco
  const cleanDateString = dateString.trim();
  
  // Se já é no formato correto YYYY-MM-DD
  if (cleanDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = cleanDateString.split('-').map(Number);
    // Validar se os valores fazem sentido
    if (year > 1900 && year < 3000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day); // month é 0-indexed
      return isValidDate(date) ? date : null;
    }
  }
  
  // Fallback para outros formatos
  try {
    const date = new Date(cleanDateString);
    if (isValidDate(date) && date.getFullYear() > 1900 && date.getFullYear() < 3000) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  } catch (error) {
    console.warn('Erro ao criar data:', dateString, error);
  }
  
  return null;
};

// Função utilitária para converter Date para string YYYY-MM-DD
export const formatDateForInput = (date: Date): string => {
  if (!isValidDate(date)) {
    console.warn('Data inválida fornecida para formatDateForInput:', date);
    return ''; // Retornar string vazia ao invés de data atual
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Função utilitária para serializar datas corretamente
export const serializeDate = (date: Date | string): string => {
  // Se já é uma string no formato correto, retornar diretamente
  if (typeof date === 'string') {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    // Tentar converter string para Date e depois serializar
    const dateObj = createLocalDate(date);
    if (dateObj && isValidDate(dateObj)) {
      return formatDateForInput(dateObj);
    }
    console.warn('Tentativa de serializar string de data inválida:', date);
    return '';
  }
  
  // Se é um objeto Date
  if (!isValidDate(date)) {
    console.warn('Tentativa de serializar data inválida:', date);
    return '';
  }
  return formatDateForInput(date);
};

// Função utilitária para deserializar datas corretamente
export const deserializeDate = (dateString: string | Date): Date => {
  // Se já é um objeto Date válido, retornar ele mesmo
  if (isValidDate(dateString)) {
    return dateString;
  }
  
  // Tentar converter usando createLocalDate
  const result = createLocalDate(dateString);
  if (result && isValidDate(result)) {
    return result;
  }
  
  // Como último recurso, retornar data atual
  console.warn('Falha ao deserializar data, usando data atual como fallback:', dateString);
  return new Date();
};
