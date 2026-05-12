import { createFileRoute } from "@tanstack/react-router";
import { Crown, Diamond, Sparkles, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { LuxLink } from "@/components/LuxButton";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — Loofah Spa Abuja" },
      { name: "description", content: "Glow, Royal Wellness and Elite Aesthetics memberships — monthly rituals, priority booking and luxury rewards at Loofah Spa Abuja." },
      { property: "og:title", content: "Membership — Loofah Spa Abuja" },
      { property: "og:description", content: "Three tiers of monthly luxury — chosen by Abuja's most discerning." },
    ],
  }),
  component: MembershipPage,
});

const TIERS = [
  {
    name: "Glow",
    icon: Sparkles,
    price: 25000,
    tagline: "Entry into the ritual",
    perks: ["1 Hydra Glow Facial monthly", "10% off all skincare products", "Birthday treatment on us", "Priority booking"],
    popular: false,
  },
  {
    name: "Royal Wellness",
    icon: Crown,
    price: 60000,
    tagline: "Skin + body in harmony",
    perks: ["2 facials OR 1 facial + 1 massage / month", "15% off products & add-ons", "Quarterly IV therapy session", "Priority booking & dedicated therapist"],
    popular: false,
  },
  {
    name: "Elite Aesthetics",
    icon: Diamond,
    price: 150000,
    tagline: "Concierge-level transformation",
    perks: ["Unlimited consultations", "Monthly facial + monthly laser/peel", "20% off everything (incl. injectables)", "Private suite booking", "Quarterly IV + annual full diagnostic"],
    popular: true,
  },
] as const;

function MembershipPage() {
  return (
    <>
      <section className="bg-ink px-6 pb-16 pt-32 text-center text-ivory lg:px-12 lg:pb-20 lg:pt-36">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Loofah Membership</span>
        <h1 className="mt-4 font-display italic text-hero">
          Self-care, <br />
          <span className="text-gradient-gold">on retainer.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-subhead text-ivory/70 font-light">
          Three tiers of monthly luxury — designed so transformation becomes a quiet, beautiful habit.
        </p>
      </section>

      <section className="bg-cream px-6 py-20 lg:px-12 lg:py-24">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-6 lg:gap-8">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className={`relative bg-ivory rounded-3xl p-8 lg:p-10 border transition-all duration-700 hover-lift ${
                t.popular
                  ? "border-gold shadow-[0_30px_80px_-30px_rgba(201,169,110,0.55)] pulse-soft"
                  : "border-nude/50"
              }`}>
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink px-4 py-1 rounded-pill font-accent text-[10px] tracking-[0.3em] uppercase">Most Popular</span>
                )}
                <t.icon size={28} className="text-gold-deep" />
                <span className="mt-6 block font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">{t.tagline}</span>
                <h3 className="mt-2 font-display italic text-4xl text-ink">{t.name}</h3>
                <div className="mt-6 gold-line origin-left" />
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-mono text-3xl text-ink">₦{t.price.toLocaleString()}</span>
                  <span className="text-ink/60 text-sm">/ month</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-3 text-ink/80 text-sm">
                      <Check size={16} className="text-gold-deep flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <LuxLink to="/book" variant={t.popular ? "primary" : "ghost"} className="w-full">
                    Join {t.name}
                  </LuxLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 text-center lg:px-12 lg:py-24">
        <Reveal>
          <p className="font-display italic text-2xl lg:text-3xl text-mocha max-w-2xl mx-auto">
            Members receive a personal therapist, sealed records, and the kind of attention reserved for very few.
          </p>
        </Reveal>
      </section>
    </>
  );
}
