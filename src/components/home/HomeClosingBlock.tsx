import { Award, Heart, Shield, Sparkles } from "lucide-react";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";
import { wa } from "@/lib/site";

export default function HomeClosingBlock() {
  return (
    <>
      <PositioningGrid />
      <FinalCTA />
    </>
  );
}

function PositioningGrid() {
  const tiles = [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583241800698-9c2e3624f0b3?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
  ];

  const badges = [
    { icon: Sparkles, label: "NGN-Friendly Pricing" },
    { icon: Shield, label: "100% Hygienic" },
    { icon: Heart, label: "Zero Judgment Zone" },
    { icon: Award, label: "Results-Guaranteed" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-24 lg:px-12 lg:py-28">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold">FCT, Nigeria</span>
          <h2 className="mt-4 font-display text-display italic text-ivory">
            Abuja&apos;s future of <br />
            <span className="text-gradient-gold">luxury aesthetics.</span>
          </h2>
        </div>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-[1400px] grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {tiles.map((src, index) => (
          <Reveal key={src} delay={index * 90}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-[1400px] grid-cols-2 gap-4 lg:grid-cols-4">
        {badges.map(({ icon: Icon, label }, index) => (
          <Reveal key={label} delay={index * 100}>
            <div className="glass-dark flex items-center gap-4 rounded-2xl p-6">
              <Icon size={22} className="shrink-0 text-gold" />
              <span className="text-sm text-ivory/85">{label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold-deep">Begin Your Ritual</span>
          <h2 className="mt-4 font-display text-display italic text-ink">
            Your transformation begins before <br className="hidden lg:block" /> you walk through the door.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-light text-subhead text-ink/70">
            Book a private consultation with one of our certified specialists. We&apos;ll design a treatment plan made
            entirely for you.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <LuxLink to="/book">Book Consultation</LuxLink>
            <LuxLink to={wa("Hi Loofah Spa! I'd like to ask a few questions.")} external variant="ghost">
              Chat on WhatsApp
            </LuxLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
