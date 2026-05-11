import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { AppRole, ProfileRecord } from "@/lib/app-data";
import { fetchProfile, fetchUserRole } from "@/lib/app-store";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  fullName: string;
}

interface AuthContextValue {
  ready: boolean;
  enabled: boolean;
  session: Session | null;
  user: User | null;
  profile: ProfileRecord | null;
  role: AppRole;
  isAdmin: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsEmailVerification: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [role, setRole] = useState<AppRole>("client");
  const [ready, setReady] = useState(false);

  async function hydrateUserState(nextSession: Session | null) {
    setSession(nextSession);

    if (!nextSession?.user) {
      setProfile(null);
      setRole("client");
      return;
    }

    const [nextProfile, nextRole] = await Promise.all([
      fetchProfile(nextSession.user.id),
      fetchUserRole(nextSession.user.id),
    ]);

    setProfile(nextProfile);
    setRole(nextRole?.role ?? "client");
  }

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let alive = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      await hydrateUserState(data.session);
      if (alive) setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, nextSession) => {
      void hydrateUserState(nextSession).finally(() => {
        if (alive) setReady(true);
      });
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      enabled: hasSupabaseConfig,
      session,
      user: session?.user ?? null,
      profile,
      role,
      isAdmin: role === "admin",
      async signIn(input) {
        if (!supabase) throw new Error("Supabase is not configured.");
        const { error } = await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });
        if (error) throw error;
      },
      async signUp(input) {
        if (!supabase) throw new Error("Supabase is not configured.");
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              full_name: input.fullName,
            },
          },
        });
        if (error) throw error;
        return {
          needsEmailVerification: !data.session,
        };
      },
      async signOut() {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      async refreshProfile() {
        if (!session?.user) return;
        const [nextProfile, nextRole] = await Promise.all([
          fetchProfile(session.user.id),
          fetchUserRole(session.user.id),
        ]);
        setProfile(nextProfile);
        setRole(nextRole?.role ?? "client");
      },
    }),
    [profile, ready, role, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
