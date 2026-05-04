/**
 * Centraliza as variáveis de ambiente usadas pelo app.
 *
 * Crie um arquivo .env.local na raiz do projeto com:
 * VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 * VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon
 */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
