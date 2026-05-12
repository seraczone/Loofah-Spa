import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveLead, upsertProfile } from "@/lib/app-store";

const STORAGE_KEY = "loofah-entry-intake-complete";

const INTEREST_OPTIONS = [
  "Facials & skincare",
  "Laser treatments",
  "Massage & wellness",
  "Body contouring",
  "Hair & scalp care",
  "Shop products",
  "Not sure yet",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EntryIntakeGate() {
  const { enabled, ready, user, profile, refreshProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    whatsapp: "",
    email: "",
    city: "Abuja",
    state: "FCT",
    interest: "",
    skinGoals: "",
    preferredContact: "whatsapp" as const,
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      fullName: current.fullName || profile?.full_name || user?.user_metadata?.full_name || "",
      whatsapp: current.whatsapp || profile?.whatsapp || "",
      email: current.email || profile?.email || user?.email || "",
      city: current.city || profile?.city || "Abuja",
      state: current.state || profile?.state || "FCT",
      skinGoals: current.skinGoals || profile?.skin_goals || "",
      preferredContact: current.preferredContact || profile?.preferred_contact || "whatsapp",
    }));
  }, [
    profile?.city,
    profile?.email,
    profile?.full_name,
    profile?.preferred_contact,
    profile?.skin_goals,
    profile?.state,
    profile?.whatsapp,
    user?.email,
    user?.user_metadata?.full_name,
  ]);

  useEffect(() => {
    if (!ready || !enabled || typeof window === "undefined") return;

    const alreadyCompleted = window.localStorage.getItem(STORAGE_KEY) === "1";
    if (profile?.visit_intake_completed_at) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setOpen(false);
      return;
    }

    if (user?.id) {
      setOpen(true);
      return;
    }

    setOpen(!alreadyCompleted);
  }, [enabled, profile?.visit_intake_completed_at, ready, user?.id]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateIntake(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setPending(true);

      await saveLead(
        {
          user_id: user?.id ?? null,
          lead_type: "visitor_intake",
          source: "entry-modal",
          name: form.fullName.trim(),
          email: form.email.trim() || null,
          whatsapp: form.whatsapp.trim(),
          message: `${form.interest.trim()} lead from ${form.city.trim()}, ${form.state.trim()}.`,
          metadata: {
            interest: form.interest.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            skin_goals: form.skinGoals.trim() || null,
            preferred_contact: form.preferredContact,
            captured_from: "site-gate",
          },
        },
        { requireSupabase: true },
      );

      if (user?.id) {
        await upsertProfile(user.id, {
          full_name: form.fullName.trim(),
          email: form.email.trim() || user.email || null,
          whatsapp: form.whatsapp.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          preferred_contact: form.preferredContact,
          skin_goals: form.skinGoals.trim() || null,
          visit_intake_completed_at: new Date().toISOString(),
        });
        await refreshProfile();
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "1");
      }

      setOpen(false);
      toast.success("Saved to CRM. You can now enter the site.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save your details right now.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  if (!enabled || !ready) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[940px] overflow-y-auto rounded-[28px] border border-gold/20 bg-dark-surface p-0 text-ivory shadow-[0_32px_120px_-48px_rgba(0,0,0,0.7)] sm:max-h-[calc(100vh-2rem)] sm:w-[calc(100vw-2rem)] lg:max-h-[min(660px,calc(100vh-2rem))] [&>button]:right-4 [&>button]:top-4 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-gold/20 [&>button]:bg-ink/68 [&>button]:text-gold-light [&>button]:opacity-100 [&>button]:ring-0 [&>button]:ring-offset-0 [&>button]:transition-colors [&>button]:hover:bg-gold [&>button]:hover:text-ink [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-gold"
      >
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <div className="border-b border-gold/12 bg-[radial-gradient(circle_at_top,_rgba(201,169,110,0.18),_transparent_58%),linear-gradient(180deg,rgba(17,14,11,0.94),rgba(17,14,11,0.99))] p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
            <DialogHeader className="text-left">
              <div className="font-accent text-[10px] tracking-[0.32em] uppercase text-gold">Welcome to Loofah</div>
              <DialogTitle className="mt-3 font-display text-3xl italic leading-tight text-ivory sm:text-[2rem]">
                Quick intake before entry.
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm leading-6 text-ivory/68">
                This is saved directly into the CRM and only needs to be done once.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-3 text-sm text-ivory/70">
              <Point text="Bookings and follow-up start faster." />
              <Point text="The team sees your goals immediately." />
              <Point text="The site unlocks after CRM save." />
            </div>

            <div className="mt-5 rounded-2xl border border-gold/15 bg-ink/35 px-4 py-3 text-xs uppercase tracking-[0.22em] text-gold-light">
              CRM capture required before entry
            </div>
          </div>

          <form onSubmit={submit} className="bg-cream p-5 text-ink sm:p-6 lg:p-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(value) => setForm((current) => ({ ...current, fullName: value }))}
                error={errors.fullName}
              />
              <Field
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(value) => setForm((current) => ({ ...current, whatsapp: value }))}
                error={errors.whatsapp}
                placeholder="0801 234 5678"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                error={errors.email}
                placeholder="Optional"
              />
              <Field
                label="City"
                value={form.city}
                onChange={(value) => setForm((current) => ({ ...current, city: value }))}
                error={errors.city}
              />
              <Field
                label="State"
                value={form.state}
                onChange={(value) => setForm((current) => ({ ...current, state: value }))}
                error={errors.state}
              />
              <label className="block sm:col-span-2 lg:col-span-1">
                <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">Interest</span>
                <select
                  value={form.interest}
                  onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border border-nude/60 bg-ivory px-4 py-3 outline-none transition-colors focus:border-gold"
                >
                  <option value="">Select one</option>
                  {INTEREST_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.interest ? <span className="mt-1 block text-xs text-destructive">{errors.interest}</span> : null}
              </label>
              <div className="block sm:col-span-2 lg:col-span-3">
                <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">Preferred contact</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(["whatsapp", "phone", "email"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, preferredContact: option }))}
                      className={`rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                        form.preferredContact === option
                          ? "border-ink bg-ink text-ivory"
                          : "border-nude/60 bg-ivory text-ink/65"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.preferredContact ? (
                  <span className="mt-1 block text-xs text-destructive">{errors.preferredContact}</span>
                ) : null}
              </div>
              <label className="block sm:col-span-2 lg:col-span-3">
                <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">Skin goals or notes</span>
                <textarea
                  value={form.skinGoals}
                  onChange={(event) => setForm((current) => ({ ...current, skinGoals: event.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full rounded-2xl border border-nude/60 bg-ivory p-3.5 outline-none transition-colors focus:border-gold"
                  placeholder="Acne, pigmentation, wellness reset, hair removal, bridal prep..."
                />
                {errors.skinGoals ? <span className="mt-1 block text-xs text-destructive">{errors.skinGoals}</span> : null}
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-shimmer mt-5 inline-flex w-full items-center justify-center rounded-pill bg-ink px-8 py-3.5 text-[12px] uppercase tracking-[0.24em] text-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Saving to CRM..." : "Save and enter"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-nude/60 bg-ivory px-4 py-3 outline-none transition-colors focus:border-gold"
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function Point({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
      <span>{text}</span>
    </div>
  );
}

function validateIntake(form: {
  fullName: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  interest: string;
  skinGoals: string;
  preferredContact: "whatsapp" | "phone" | "email";
}) {
  const nextErrors: Record<string, string> = {};
  const fullName = form.fullName.trim();
  const whatsapp = form.whatsapp.trim();
  const email = form.email.trim();
  const city = form.city.trim();
  const state = form.state.trim();
  const interest = form.interest.trim();
  const skinGoals = form.skinGoals.trim();

  if (fullName.length < 2) nextErrors.fullName = "Enter your full name.";
  if (whatsapp.length < 7) nextErrors.whatsapp = "Enter a reachable WhatsApp number.";
  if (email && !EMAIL_PATTERN.test(email)) nextErrors.email = "Use a valid email.";
  if (city.length < 2) nextErrors.city = "Enter your city.";
  if (state.length < 2) nextErrors.state = "Enter your state.";
  if (interest.length < 2) nextErrors.interest = "Tell us what you are interested in.";
  if (skinGoals.length > 400) nextErrors.skinGoals = "Keep this under 400 characters.";
  if (!["whatsapp", "phone", "email"].includes(form.preferredContact)) {
    nextErrors.preferredContact = "Choose how you want to be contacted.";
  }

  return nextErrors;
}
