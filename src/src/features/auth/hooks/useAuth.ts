import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../../types';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const handleRegister = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginDate');
    setCurrentUser(null);
  }, []);

  const switchAuthScreen = useCallback((screen: 'login' | 'register') => {
    setAuthScreen(screen);
  }, []);

  return {
    currentUser,
    authScreen,
    handleLogin,
    handleRegister,
    handleLogout,
    switchAuthScreen,
    isAuthenticated: !!currentUser,
  };
}