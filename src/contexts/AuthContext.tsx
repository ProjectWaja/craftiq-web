'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) return { error: { message: 'Auth not configured.' } as AuthError };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch {
      return { error: { message: 'Network error. Please try again.' } as AuthError };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) return { error: { message: 'Auth not configured.' } as AuthError };
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch {
      return { error: { message: 'Network error. Please try again.' } as AuthError };
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) { setUser(null); return; }
    try {
      await supabase.auth.signOut();
    } catch {
      // Graceful degradation
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
