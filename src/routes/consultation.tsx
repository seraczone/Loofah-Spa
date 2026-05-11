import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LuxLink } from "@/components/LuxButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { saveLead } from "@/lib/app-store";
import { SERVICES, formatNGN, type Service } from "@/lib/services";
import { wa } from "@/lib/site";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "AI Skin Consultation - Loofah Spa Abuja" },
      {
        name: "description",
        content: "Answer 5 quick questions and receive a personalised treatment plan from Loofah Spa Abuja's clinical team.",
      },
      { property: "og:title", content: "AI Skin Consultation - Loofah Spa Abuja" },
      { property: "og:description", content: "Discover your perfect treatment in under 60 seconds." },
    ],
  }),
  component: Consultation,
});

type Concern =
  | "Acne"
  | "Pigmentation"
  | "Anti-Aging"
  | "Hair Removal"
  | "Hair Thinning"
  | "Stretch Marks"
  | "Wellness";
type SkinType = "Oily" | "Dry" | "Combination" | "Normal" | "Sensitive";
type History = "Never" | "Basic facials" | "Professional treatments" | "Ongoing programme";
type Budget = "Under NGN30k" | "NGN30k-NGN80k" | "NGN80k-NGN200k" | "Premium / no limit";

interface Answers {
  concern?: Concern;
  skin?: SkinType;
  history?: History;
  budget?: Budget;
  name?: string;
  whatsapp?: string;
  email?: string;
}

const CONCERNS: Concern[] = [
  "Acne",
  "Pigmentation",
  "Anti-Aging",
  "Hair Removal",
  "Hair Thinning",
  "Stretch Marks",
  "Wellness",
];
const SKINS: SkinType[] = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
const HISTORY: History[] = ["Never", "Basic facials", "Professional treatments", "Ongoing programme"];
const BUDGETS: Budget[] = [
  "Under NGN30k",
  "NGN30k-NGN80k",
  "NGN80k-NGN200k",
  "Premium / no limit",
];

function recommend(answer: Answers): Service[] {
  const map: Record<Concern, string[]> = {
    Acne: ["acne-treatment", "chemical-peels", "hydra-glow-facial"],
    Pigmentation: ["facial-brightening", "chemical-peels", "microneedling"],
    "Anti-Aging": ["botox", "microneedling", "mesotherapy"],
    "Hair Removal": ["laser-hair-removal", "vaginal-rejuvenation", "facial-brightening"],
    "Hair Thinning": ["prp-hair", "iv-therapy", "wellness-massage"],
    "Stretch Marks": ["stretch-mark-treatment", "lipolysis", "microneedling"],
    Wellness: ["wellness-massage", "iv-therapy", "manicure-pedicure"],
  };

  const slugs = answer.concern ? map[answer.concern] : ["hydra-glow-facial", "wellness-massage", "iv-therapy"];
  return slugs.map((slug) => SERVICES.find((service) => service.slug === slug)!).filter(Boolean);
}

function Consultation() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setAnswers((current) => ({
      ...current,
      name: current.name || profile?.full_name || user?.user_metadata?.full_name || "",
      whatsapp: current.whatsapp || profile?.whatsapp || "",
      email: current.email || user?.email || "",
    }));
  }, [profile?.full_name, profile?.whatsapp, user?.email, user?.user_metadata?.full_name]);

  const next = () => setStep((current) => Math.min(current + 1, 4));
  const back = () => setStep((current) => Math.max(current - 1, 0));
  const set = (patch: Partial<Answers>) => setAnswers((current) => ({ ...current, ...patch }));

  const stepValid =
    (step === 0 && answers.concern) ||
    (step === 1 && answers.skin) ||
    (step === 2 && answers.history) ||
    (step === 3 && answers.budget) ||
    (step === 4 && answers.name && answers.whatsapp);

  if (done) {
    const recommendations = recommend(answers);
    return (
      <section className="min-h-screen bg-ink text-ivory pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <Sparkles size={32} className="mx-auto text-gold" />
          <h1 className="mt-6 font-display italic text-display">
            Your personalised plan is ready,{" "}
            <span className="text-gradient-gold">{answers.name?.split(" ")[0]}</span>.
          </h1>
          <p className="mt-4 text-ivory/70 max-w-xl mx-auto">
            Here are the three treatments most aligned with your goals. Tap any to learn more, or message us on WhatsApp to book.
          </p>

          <div className="mt-14 grid md:grid-cols-3 gap-6 text-left">
            {recommendations.map((recommendation) => (
              <div key={recommendation.slug} className="bg-dark-card rounded-3xl overflow-hidden border border-gold/15 hover-lift">
                <div className="aspect-[5/3] overflow-hidden">
                  <img src={recommendation.image} alt={recommendation.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold">{recommendation.category}</span>
                  <h3 className="mt-2 font-display italic text-2xl text-ivory">{recommendation.name}</h3>
                  <p className="mt-3 text-sm text-ivory/65 line-clamp-2">{recommendation.shortDesc}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono text-ivory/60">
                    <span>{recommendation.duration}</span>
                    <span className="text-gold-light">From {formatNGN(recommendation.priceFrom)}</span>
                  </div>
                  <div className="mt-5">
                    <LuxLink
                      to={wa(
                        `Hi Loofah Spa! I just completed the AI Skin Consultation and want to learn more about ${recommendation.name}.`,
                      )}
                      external
                      variant="secondary"
                      className="w-full !py-3 !text-[10px]"
                    >
                      Ask About This
                    </LuxLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <p className="mb-5 text-sm text-ivory/55">Your consultation answers are now in the client pipeline.</p>
            <LuxLink to="/book">Book My Consultation</LuxLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-ink text-ivory pt-32 pb-24 px-6 lg:px-12 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center">
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">AI Skin Consultation</span>
          <h1 className="mt-4 font-display italic text-display">
            Discover your <span className="text-gradient-gold">perfect treatment.</span>
          </h1>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step ? "w-10 bg-gold" : index < step ? "w-3 bg-gold/60" : "w-3 bg-ivory/20"
              }`}
            />
          ))}
        </div>

        <div className="mt-14 glass-dark rounded-3xl p-8 lg:p-12 flex-1">
          {step === 0 ? (
            <Step title="What's your primary skin concern?">
              <Choices options={CONCERNS} value={answers.concern} onChange={(value) => set({ concern: value as Concern })} />
            </Step>
          ) : null}
          {step === 1 ? (
            <Step title="How would you describe your skin?">
              <Choices options={SKINS} value={answers.skin} onChange={(value) => set({ skin: value as SkinType })} />
            </Step>
          ) : null}
          {step === 2 ? (
            <Step title="Have you had professional treatments before?">
              <Choices options={HISTORY} value={answers.history} onChange={(value) => set({ history: value as History })} />
            </Step>
          ) : null}
          {step === 3 ? (
            <Step title="What's your comfortable budget per session?">
              <Choices options={BUDGETS} value={answers.budget} onChange={(value) => set({ budget: value as Budget })} />
            </Step>
          ) : null}
          {step === 4 ? (
            <Step title="Where should we send your plan?">
              <div className="space-y-4 max-w-md mx-auto">
                <Field label="Full Name" value={answers.name ?? ""} onChange={(value) => set({ name: value })} placeholder="Your name" />
                <Field
                  label="WhatsApp Number"
                  value={answers.whatsapp ?? ""}
                  onChange={(value) => set({ whatsapp: value })}
                  placeholder="0801 234 5678"
                />
                <Field
                  label="Email (optional)"
                  value={answers.email ?? ""}
                  onChange={(value) => set({ email: value })}
                  placeholder="you@email.com"
                />
              </div>
            </Step>
          ) : null}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-ivory/70 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {step < 4 ? (
            <button
              onClick={next}
              disabled={!stepValid}
              className="btn-shimmer inline-flex items-center gap-2 rounded-pill bg-gold text-ink px-9 py-4 text-[12px] tracking-[0.22em] uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!stepValid) return;
                try {
                  setSubmitting(true);
                  const result = await saveLead({
                    user_id: user?.id ?? null,
                    lead_type: "consultation",
                    source: "ai-consultation",
                    name: answers.name ?? "",
                    email: answers.email ?? null,
                    whatsapp: answers.whatsapp ?? null,
                    message: `Concern: ${answers.concern}; Skin: ${answers.skin}; History: ${answers.history}; Budget: ${answers.budget}`,
                    metadata: {
                      concern: answers.concern,
                      skin: answers.skin,
                      history: answers.history,
                      budget: answers.budget,
                      recommendations: recommend(answers).map((item) => item.slug),
                    },
                  });
                  void result;
                  setDone(true);
                  toast.success("Consultation saved.");
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Unable to save consultation.";
                  toast.error(message);
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={!stepValid || submitting}
              className="btn-shimmer inline-flex items-center gap-2 rounded-pill bg-gold text-ink px-9 py-4 text-[12px] tracking-[0.22em] uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Reveal My Plan"} <Sparkles size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display italic text-3xl lg:text-4xl text-ivory text-center">{title}</h2>
      <div className="mt-10">{children}</div>
    </div>
  );
}

function Choices({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-2xl border p-5 text-left transition-all duration-500 ${
            value === option
              ? "bg-gold text-ink border-gold"
              : "bg-transparent text-ivory/85 border-ivory/15 hover:border-gold/60 hover:text-ivory"
          }`}
        >
          <span className="font-heading text-lg">{option}</span>
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-ivory/30 focus:border-gold outline-none py-3 text-ivory placeholder:text-ivory/30 font-body"
      />
    </label>
  );
}
