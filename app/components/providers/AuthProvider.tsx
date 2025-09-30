"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  anonymousUserId: string | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  mergeAccounts: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [anonymousUserId, setAnonymousUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate or retrieve anonymous user ID
  useEffect(() => {
    const getOrCreateAnonymousUserId = () => {
      try {
        let storedId = localStorage.getItem('anonymous_user_id');
        if (!storedId) {
          storedId = crypto.randomUUID();
          localStorage.setItem('anonymous_user_id', storedId);
        }
        setAnonymousUserId(storedId);
      } catch (error) {
        console.error('Error managing anonymous user ID:', error);
        // Fallback to session storage if localStorage fails
        try {
          let storedId = sessionStorage.getItem('anonymous_user_id');
          if (!storedId) {
            storedId = crypto.randomUUID();
            sessionStorage.setItem('anonymous_user_id', storedId);
          }
          setAnonymousUserId(storedId);
        } catch (sessionError) {
          console.error('Error with session storage:', sessionError);
        }
      }
    };

    getOrCreateAnonymousUserId();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // If user just signed in and we have an anonymous user ID, merge accounts
        if (event === 'SIGNED_IN' && session?.user && anonymousUserId) {
          try {
            await mergeAccounts();
          } catch (error) {
            console.error('Error merging accounts after sign in:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [anonymousUserId]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear anonymous user ID when signing out
      localStorage.removeItem('anonymous_user_id');
      sessionStorage.removeItem('anonymous_user_id');
      setAnonymousUserId(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const mergeAccounts = async () => {
    if (!user || !anonymousUserId) {
      return { success: false, error: 'No user or anonymous ID to merge' };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'No active session' };
      }

      const response = await fetch('/api/merge-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ anonymousUserId })
      });

      const result = await response.json();

      if (response.ok) {
        // Clear the anonymous user ID after successful merge
        localStorage.removeItem('anonymous_user_id');
        sessionStorage.removeItem('anonymous_user_id');
        setAnonymousUserId(null);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error merging accounts:', error);
      return { success: false, error: 'Failed to merge accounts' };
    }
  };

  const value = {
    user,
    session,
    anonymousUserId,
    loading,
    signInWithMagicLink,
    signOut,
    mergeAccounts
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
