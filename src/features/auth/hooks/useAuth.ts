import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../../types';
import { authService } from '../../../services/authService';
import { isSupabaseConfigured } from '../../../config/env';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsLoading(true);
      setAuthError(null);

      if (!isSupabaseConfigured) {
        setCurrentUser(null);
        setAuthError('Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
        setIsLoading(false);
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (isMounted) setCurrentUser(user);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        if (isMounted) {
          setCurrentUser(null);
          setAuthError('Não foi possível carregar a sessão. Tente entrar novamente.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSession();

    if (!isSupabaseConfigured) {
      return () => { isMounted = false; };
    }

    const { data } = authService.onAuthStateChange((_event, _session, user) => {
      if (isMounted) {
        setCurrentUser(user);
        setAuthError(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setAuthError(null);
  }, []);

  const handleRegister = useCallback((user: User) => {
    setCurrentUser(user);
    setAuthError(null);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const switchAuthScreen = useCallback((screen: 'login' | 'register' | 'forgot-password') => {
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
    isLoading,
    authError,
  };
}
