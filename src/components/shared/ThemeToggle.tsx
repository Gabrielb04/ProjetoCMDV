import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  // Inicializar com tema do localStorage ou 'light' como padrão
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      return savedTheme || 'light';
    }
    return 'light';
  });

  // Aplicar tema na inicialização e sincronizar com localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // Por padrão sempre usar tema claro se não há preferência salva
    const initialTheme = savedTheme || 'light';
    
    // Se não há tema salvo, salvar o padrão (claro)
    if (!savedTheme) {
      localStorage.setItem('theme', 'light');
    }
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Aplicar tema ao documento
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 p-0"
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
    </Button>
  );
}