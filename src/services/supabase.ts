import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../config/env';

/**
 * Cliente Supabase único da aplicação.
 *
 * Na Fase 1 ele apenas prepara a integração. As telas continuam usando
 * localStorage até migrarmos auth, veículos e manutenções nas próximas fases.
 */
export const supabase = isSupabaseConfigured
  ? createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local.'
    );
  }

  return supabase;
}
