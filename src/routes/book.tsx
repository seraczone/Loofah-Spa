import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/providers/AuthProvider";
import { BOOKING_SLOTS, buildAppointmentWindow, durationToMinutes, formatSlotLabel } from "@/lib/booking";
import { fetchBookedSlots, saveBooking } from "@/lib/app-store";
import { CATEGORIES, SERVICES, formatNGN, type Category } from "@/lib/services";
import { wa } from "@/lib/site";

const search = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Book a Treatment - Loofah Spa Abuja" },
      {
        name: "description",
        content: "Reserve your consultation at Loofah Spa Abuja. Choose your treatment, date and therapist in minutes.",
      },
      { property: "og:title", content: "Book a Treatment - Loofah Spa" },
      { property: "og:description", content: "Reserve your private consultation in Wuse, Abuja." },
    ],
  }),
  component: BookPage,
});

interface BookingDraft {
  category?: "All" | Category;
  serviceSlug?: string;
  date?: string;
  time?: string;
  name?: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
  preferredTherapist?: string;
}

function BookPage() {
  const searchParams = useSearch({ from: "/book" });
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>({
    category: "All",
    serviceSlug: searchParams.service,
  });
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      name: current.name || profile?.full_name || user?.user_metadata?.full_name || "",
      whatsapp: current.whatsapp || profile?.whatsapp || "",
      email: current.email || profile?.email || user?.email || "",
    }));
  }, [profile?.email, profile?.full_name, profile?.whatsapp, user?.email, user?.user_metadata?.full_name]);

  useEffect(() => {
    if (!draft.date) {
      setOccupiedSlots([]);
      return;
    }

    let alive = true;
    setAvailabilityLoading(true);

    fetchBookedSlots(draft.date)
      .then((slots) => {
        if (!alive) return;
        setOccupiedSlots(slots);
        setDraft((current) =>
          current.time && slots.includes(current.time)
            ? { ...current, time: undefined }
            : current,
        );
      })
      .catch((error) => {
        if (!alive) return;
        const message = error instanceof Error ? error.message : "Could not load availability.";
        toast.error(message);
      })
      .finally(() => {
        if (alive) setAvailabilityLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [draft.date]);

  const set = (patch: Partial<BookingDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const filtered =
    draft.category && draft.category !== "All"
      ? SERVICES.filter((service) => service.category === draft.category)
      : SERVICES;

  const selected = SERVICES.find((service) => service.slug === draft.serviceSlug);
  const selectedDuration = selected ? durationToMinutes(selected.duration) : 60;
  const timeStepReady = Boolean(draft.date && draft.time);
  const validity = [
    Boolean(draft.category),
    Boolean(draft.serviceSlug),
    timeStepReady,
    Boolean(draft.name && draft.whatsapp),
  ];

  const next = () => setStep((current) => Math.min(current + 1, 3));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const submitBooking = async () => {
    if (!selected || !draft.date || !draft.time || !validity[3]) return;

    try {
      setSubmitting(true);
      const window = buildAppointmentWindow(draft.date, draft.time, selectedDuration);
      await saveBooking(
        {
          user_id: user?.id ?? null,
          category: draft.category ?? null,
          service_slug: selected.slug,
          service_name: selected.name,
          booking_date: draft.date,
          booking_time: draft.time,
          duration_minutes: selectedDuration,
          appointment_start_at: window.startIso,
          appointment_end_at: window.endIso,
          name: draft.name ?? "",
          email: draft.email ?? null,
          whatsapp: draft.whatsapp ?? "",
          notes: draft.notes ?? null,
          preferred_therapist: draft.preferredTherapist ?? null,
          source: "booking-flow",
          metadata: {
            source: "booking-flow",
            price_from: selected.priceFrom,
            duration_label: selected.duration,
            calendar: "brand-operations",
          },
        },
        { requireSupabase: true },
      );
      setDone(true);
      toast.success("Appointment added to the live calendar.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done && selected) {
    return (
      <section className="flex min-h-screen items-center bg-ivory px-6 pb-24 pt-32 lg:px-12">
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="pulse-soft mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold">
            <Check size={28} className="text-ink" strokeWidth={3} />
          </div>
          <h1 className="mt-8 font-display text-display italic text-ink">Your appointment is on the calendar.</h1>
          <p className="mx-auto mt-4 max-w-md text-ink/70">
            We have saved your slot in the live studio calendar and the team will follow up on WhatsApp if anything needs confirming.
          </p>

          <div className="mt-12 rounded-3xl border border-nude/40 bg-cream p-8 text-left">
            <h3 className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">Appointment summary</h3>
            <div className="mt-6 space-y-3 text-ink">
              <Row k="Treatment" v={selected.name} />
              <Row k="Date" v={draft.date ?? ""} />
              <Row k="Time" v={formatSlotLabel(draft.time ?? "")} />
              <Row k="Duration" v={`${selectedDuration} minutes`} />
              <Row k="Guest" v={draft.name ?? ""} />
              <Row k="WhatsApp" v={draft.whatsapp ?? ""} />
              {draft.preferredTherapist ? <Row k="Therapist request" v={draft.preferredTherapist} /> : null}
              <Row k="Investment" v={`From ${formatNGN(selected.priceFrom)}`} />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={wa(
                `Hi Loofah Spa! I just booked ${selected.name} on ${draft.date} at ${formatSlotLabel(
                  draft.time ?? "",
                )}. My name is ${draft.name}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer rounded-pill bg-[#25D366] px-9 py-4 text-[12px] uppercase tracking-[0.22em] text-white"
            >
              Confirm on WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-6 pb-24 pt-32 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold-deep">Book a Treatment</span>
          <h1 className="mt-4 font-display text-display italic text-ink">Reserve your ritual.</h1>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step ? "w-10 bg-gold" : index < step ? "w-3 bg-gold/60" : "w-3 bg-ink/15"
              }`}
            />
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-nude/40 bg-ivory p-6 shadow-[0_30px_80px_-40px_rgba(107,79,58,0.25)] md:p-10">
          {step === 0 ? (
            <>
              <h2 className="text-center font-display text-3xl italic text-ink">Choose a category</h2>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => set({ category, serviceSlug: undefined })}
                    className={`rounded-pill border px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-all duration-500 ${
                      draft.category === category
                        ? "border-ink bg-ink text-ivory"
                        : "border-nude bg-transparent text-ink/70 hover:border-gold"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h2 className="text-center font-display text-3xl italic text-ink">Select your treatment</h2>
              <div className="mt-8 grid max-h-[420px] gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
                {filtered.map((service) => (
                  <button
                    key={service.slug}
                    onClick={() => set({ serviceSlug: service.slug })}
                    className={`rounded-2xl border p-5 text-left transition-all duration-500 ${
                      draft.serviceSlug === service.slug
                        ? "border-gold bg-gold text-ink"
                        : "border-nude/40 bg-cream hover:border-gold"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-heading text-lg leading-snug">{service.name}</span>
                      <span className="font-mono text-xs whitespace-nowrap">{formatNGN(service.priceFrom)}</span>
                    </div>
                    <span className="mt-2 block text-xs opacity-70">
                      {service.duration} / {service.category}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 className="text-center font-display text-3xl italic text-ink">Pick a date and time</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <label className="block">
                  <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">Date</span>
                  <div className="relative mt-2">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep" />
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={draft.date ?? ""}
                      onChange={(event) => set({ date: event.target.value })}
                      className="w-full rounded-pill border border-nude/60 bg-cream py-4 pl-11 pr-5 outline-none transition-colors focus:border-gold"
                    />
                  </div>
                </label>
                <div>
                  <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">Live availability</span>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {BOOKING_SLOTS.map((time) => {
                      const occupied = occupiedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => set({ time })}
                          disabled={!draft.date || occupied || availabilityLoading}
                          className={`rounded-pill border py-3 text-sm font-mono transition-all ${
                            draft.time === time
                              ? "border-ink bg-ink text-ivory"
                              : occupied
                                ? "cursor-not-allowed border-nude/30 bg-nude/20 text-ink/35"
                                : "border-nude/60 bg-cream hover:border-gold"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          <div>{formatSlotLabel(time)}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.18em]">
                            {!draft.date ? "Pick date" : occupied ? "Booked" : "Open"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm text-ink/55">
                    {availabilityLoading
                      ? "Checking the live calendar..."
                      : draft.date
                        ? "Open slots update in real time from the admin calendar."
                        : "Choose a date to load the live calendar."}
                  </p>
                </div>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h2 className="text-center font-display text-3xl italic text-ink">Your details</h2>
              <div className="mx-auto mt-8 grid max-w-2xl gap-5 md:grid-cols-2">
                <Input label="Full name" value={draft.name ?? ""} onChange={(value) => set({ name: value })} />
                <Input
                  label="WhatsApp number"
                  value={draft.whatsapp ?? ""}
                  onChange={(value) => set({ whatsapp: value })}
                  placeholder="0801 234 5678"
                />
                <Input
                  label="Email"
                  value={draft.email ?? ""}
                  onChange={(value) => set({ email: value })}
                  className="md:col-span-2"
                />
                <Input
                  label="Preferred therapist"
                  value={draft.preferredTherapist ?? ""}
                  onChange={(value) => set({ preferredTherapist: value })}
                  className="md:col-span-2"
                  placeholder="Optional"
                />
                <label className="block md:col-span-2">
                  <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">Notes</span>
                  <textarea
                    value={draft.notes ?? ""}
                    onChange={(event) => set({ notes: event.target.value })}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-nude/60 bg-cream p-4 outline-none focus:border-gold"
                  />
                </label>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-ink/70 hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={next}
              disabled={!validity[step]}
              className="btn-shimmer inline-flex items-center gap-2 rounded-pill bg-ink px-9 py-4 text-[12px] uppercase tracking-[0.22em] text-ivory disabled:cursor-not-allowed disabled:opacity-30"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => void submitBooking()}
              disabled={!validity[3] || submitting}
              className="btn-shimmer inline-flex items-center gap-2 rounded-pill bg-gold px-9 py-4 text-[12px] uppercase tracking-[0.22em] text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              {submitting ? "Saving..." : "Confirm Booking"} <Sparkles size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-nude/40 pb-2">
      <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-pill border border-nude/60 bg-cream px-5 py-4 outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}
