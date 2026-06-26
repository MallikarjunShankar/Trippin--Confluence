// Auth state hook backed by Lovable Cloud (Supabase under the hood).
// Components import { useAuth } from here. No component should touch
// the supabase client for auth concerns except this hook.

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/types";

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

function toAuthUser(sessionUser: { id: string; email?: string | null } | null | undefined): AuthUser | null {
  if (!sessionUser || !sessionUser.email) return null;
  return { id: sessionUser.id, email: sessionUser.email };
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Synchronous listener first — never trust async-only auth checks.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(toAuthUser(session?.user));
      },
    );

    // Then hydrate initial session.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(toAuthUser(data.session?.user));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectTo =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, loading, signIn, signUp, signOut };
}
