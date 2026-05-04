import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '../types';
import { requireSupabaseClient } from './supabase';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

function mapSupabaseUser(user: SupabaseUser): User {
  const metadataName = user.user_metadata?.name;
  const fallbackName = user.email?.split('@')[0] || 'Usuário';

  return {
    id: user.id,
    email: user.email ?? '',
    name: typeof metadataName === 'string' && metadataName.trim().length > 0
      ? metadataName
      : fallbackName,
  };
}

export const authService = {
  async emailExists(email: string): Promise<boolean> {
    const client = requireSupabaseClient();
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await client.rpc('email_cadastrado', {
      email_input: normalizedEmail,
    });

    if (error) {
      console.error('Erro ao verificar e-mail cadastrado:', error);
      throw new Error('Não foi possível verificar este e-mail. Confirme se a função email_cadastrado foi criada no Supabase.');
    }

    return data === true;
  },

  async signIn({ email, password }: AuthCredentials): Promise<User> {
    const client = requireSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Usuário não retornado pelo Supabase.');

    return mapSupabaseUser(data.user);
  },

  async signUp({ name, email, password }: RegisterCredentials): Promise<User> {
    const client = requireSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Usuário não retornado pelo Supabase.');

    return mapSupabaseUser(data.user);
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    const client = requireSupabaseClient();
    const normalizedEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/reset-password`;

    const exists = await this.emailExists(normalizedEmail);

    if (!exists) {
      throw new Error('EMAIL_NOT_REGISTERED');
    }

    const { error } = await client.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });

    if (error) throw error;
  },

  async updatePassword(password: string): Promise<void> {
    const client = requireSupabaseClient();
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
  },

  async signOut(): Promise<void> {
    const client = requireSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const client = requireSupabaseClient();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();

    if (sessionError) throw sessionError;
    if (!sessionData.session?.user) return null;

    return mapSupabaseUser(sessionData.session.user);
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null, user: User | null) => void) {
    const client = requireSupabaseClient();

    return client.auth.onAuthStateChange((event, session) => {
      callback(event, session, session?.user ? mapSupabaseUser(session.user) : null);
    });
  },
};
