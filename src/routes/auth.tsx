import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, LogIn, Shield } from "lucide-react";
import { toast } from "sonner";
import { LuxButton, LuxLink } from "@/components/LuxButton";
import { useAuth } from "@/components/providers/AuthProvider";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In - Loofah Spa Abuja" },
      {
        name: "description",
        content:
          "Create a Loofah Spa account to track bookings, check out faster and access the admin workspace.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { enabled, ready, user, isAdmin, signIn, signOut, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const destination = useMemo(
    () => search.next ?? (isAdmin ? "/admin" : "/shop"),
    [isAdmin, search.next],
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAuthForm(form, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setPending(true);
      if (mode === "signin") {
        await signIn({ email: form.email, password: form.password });
        toast.success("Signed in.");
        void navigate({ to: destination });
      } else {
        const result = await signUp({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        toast.success(
          result.needsEmailVerification
            ? "Check your email to confirm your account."
            : "Your account is ready.",
        );
        if (!result.needsEmailVerification) {
          void navigate({ to: destination });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  if (!ready) {
    return (
      <section className="min-h-screen bg-ivory pt-32 pb-24 px-6 lg:px-12 flex items-center justify-center">
        <div className="rounded-3xl bg-cream px-8 py-10 text-center text-ink/70">Loading account access...</div>
      </section>
    );
  }

  if (!enabled) {
    return (
      <section className="min-h-screen bg-cream pt-32 pb-24 px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl mx-auto w-full rounded-[32px] border border-nude/50 bg-ivory p-10 lg:p-14 text-center">
          <Shield size={30} className="mx-auto text-gold-deep" />
          <h1 className="mt-6 font-display italic text-display text-ink">Auth is configured through Supabase.</h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto">
            Add your public project URL and anon key in <code>.env.local</code> to enable sign-in, profile-aware bookings and the admin workspace.
          </p>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="min-h-screen bg-ivory pt-32 pb-24 px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl mx-auto w-full rounded-[34px] border border-nude/50 bg-cream p-10 lg:p-14 text-center">
          <CheckCircle2 size={34} className="mx-auto text-gold-deep" />
          <h1 className="mt-6 font-display italic text-display text-ink">You are signed in.</h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto">
            Continue to your next step or sign out and switch accounts.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LuxLink to={isAdmin ? "/admin" : "/shop"}>
              {isAdmin ? "Open Admin" : "Open Shop"} <ArrowRight size={14} />
            </LuxLink>
            <LuxLink to="/book" variant="ghost">
              Book a Treatment
            </LuxLink>
            <LuxButton variant="secondary" onClick={() => void signOut()}>
              Sign Out
            </LuxButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-dark-surface text-ivory pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
        <div className="rounded-[34px] border border-gold/15 bg-dark-card p-8 lg:p-12">
          <div className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Loofah Account</div>
          <h1 className="mt-5 font-display italic text-display">
            Save time at checkout and keep every ritual in one place.
          </h1>
          <ul className="mt-10 space-y-5 text-ivory/72">
            <Feature text="Prefill bookings, consultations and checkout details." />
            <Feature text="Track incoming orders and booking requests in a single account." />
            <Feature text="Unlock the protected admin dashboard with the right role." />
          </ul>
          <div className="mt-10 rounded-3xl border border-gold/15 bg-ink/40 p-6 text-left">
            <div className="font-accent text-[10px] tracking-[0.26em] uppercase text-gold-light">Admin note</div>
            <p className="mt-3 text-sm text-ivory/65">
              Admin access depends on the <code>user_roles</code> table in the Supabase migration.
            </p>
          </div>
        </div>

        <div className="rounded-[34px] border border-nude/30 bg-ivory p-8 lg:p-12 text-ink">
          <div className="flex gap-2 rounded-full border border-nude/50 bg-cream p-1 w-fit">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-full px-5 py-2 text-[11px] tracking-[0.24em] uppercase transition-colors ${
                mode === "signin" ? "bg-ink text-ivory" : "text-ink/65"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-full px-5 py-2 text-[11px] tracking-[0.24em] uppercase transition-colors ${
                mode === "signup" ? "bg-ink text-ivory" : "text-ink/65"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="mt-10 space-y-5">
            {mode === "signup" ? (
              <InputField
                label="Full name"
                value={form.fullName}
                onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
                error={errors.fullName}
                placeholder="Amaka Okafor"
              />
            ) : null}
            <InputField
              label="Email"
              value={form.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              error={errors.email}
              placeholder="you@example.com"
              type="email"
            />
            <InputField
              label="Password"
              value={form.password}
              onChange={(value) => setForm((current) => ({ ...current, password: value }))}
              error={errors.password}
              placeholder="At least 8 characters"
              type="password"
            />
            <LuxButton type="submit" className="w-full !justify-center" disabled={pending}>
              {pending ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              <LogIn size={14} />
            </LuxButton>
          </form>
        </div>
      </div>
    </section>
  );
}

function validateAuthForm(
  form: {
    fullName: string;
    email: string;
    password: string;
  },
  mode: "signin" | "signup",
) {
  const nextErrors: Record<string, string> = {};
  const email = form.email.trim();
  const password = form.password;
  const fullName = form.fullName.trim();

  if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Use a valid email.";
  if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
  if (mode === "signup" && fullName.length < 2) nextErrors.fullName = "Enter your full name.";

  return nextErrors;
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-gold" />
      <span>{text}</span>
    </li>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-nude/60 bg-cream px-5 py-4 outline-none transition-colors focus:border-gold"
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
