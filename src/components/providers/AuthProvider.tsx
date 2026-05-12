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

type AuthServices = {
  supabase: NonNullable<(typeof import("@/lib/supabase"))["supabase"]>;
  fetchProfile: (typeof import("@/lib/app-store"))["fetchProfile"];
  fetchUserRole: (typeof import("@/lib/app-store"))["fetchUserRole"];
};

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL?.trim() && import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
);

const AuthContext = createContext<AuthContextValue | null>(null);

let authServicesPromise: Promise<AuthServices | null> | null = null;

function loadAuthServices() {
  if (!hasSupabaseConfig) {
    return Promise.resolve<AuthServices | null>(null);
  }

  authServicesPromise ??= Promise.all([import("@/lib/supabase"), import("@/lib/app-store")]).then(
    ([supabaseModule, storeModule]) => {
      if (!supabaseModule.supabase) return null;
      return {
        supabase: supabaseModule.supabase,
        fetchProfile: storeModule.fetchProfile,
        fetchUserRole: storeModule.fetchUserRole,
      };
    },
  );

  return authServicesPromise;
}

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

    const services = await loadAuthServices();
    if (!services) {
      setProfile(null);
      setRole("client");
      return;
    }

    const [nextProfile, nextRole] = await Promise.all([
      services.fetchProfile(nextSession.user.id),
      services.fetchUserRole(nextSession.user.id),
    ]);

    setProfile(nextProfile);
    setRole(nextRole?.role ?? "client");
  }

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setReady(true);
      return;
    }

    let alive = true;
    let unsubscribe: (() => void) | null = null;

    void loadAuthServices()
      .then((services) => {
        if (!alive || !services) {
          if (alive) setReady(true);
          return;
        }

        void services.supabase.auth
          .getSession()
          .then(async ({ data }) => {
            if (!alive) return;
            await hydrateUserState(data.session);
            if (alive) setReady(true);
          })
          .catch(() => {
            if (alive) setReady(true);
          });

        const { data: listener } = services.supabase.auth.onAuthStateChange((_, nextSession) => {
          void hydrateUserState(nextSession).finally(() => {
            if (alive) setReady(true);
          });
        });

        unsubscribe = () => listener.subscription.unsubscribe();
      })
      .catch(() => {
        if (alive) setReady(true);
      });

    return () => {
      alive = false;
      unsubscribe?.();
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
        const services = await loadAuthServices();
        if (!services) throw new Error("Supabase is not configured.");
        const { error } = await services.supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });
        if (error) throw error;
      },
      async signUp(input) {
        const services = await loadAuthServices();
        if (!services) throw new Error("Supabase is not configured.");
        const { data, error } = await services.supabase.auth.signUp({
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
        const services = await loadAuthServices();
        if (!services) return;
        const { error } = await services.supabase.auth.signOut();
        if (error) throw error;
      },
      async refreshProfile() {
        if (!session?.user) return;
        const services = await loadAuthServices();
        if (!services) return;
        const [nextProfile, nextRole] = await Promise.all([
          services.fetchProfile(session.user.id),
          services.fetchUserRole(session.user.id),
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
