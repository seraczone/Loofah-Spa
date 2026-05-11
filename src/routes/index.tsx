import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Star, Sparkles, Award, Heart, Shield } from "lucide-react";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";
import { SERVICES, formatNGN } from "@/lib/services";
import { wa } from "@/lib/site";
import { ShopPreview } from "@/components/ShopPreview";
import { InstagramWall } from "@/components/InstagramWall";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loofah Spa Abuja — Luxury Skin, Laser & Wellness in Wuse" },
      { name: "description", content: "Abuja's most luxurious skin, laser & wellness destination on Mombasa Street, Wuse. Book hydra facials, laser hair removal, microneedling and more." },
      { property: "og:title", content: "Loofah Spa Abuja — Luxury Skin, Laser & Wellness" },
      { property: "og:description", content: "Where science meets serenity. Book your private consultation in Wuse, Abuja." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <ServicesPreview />
      <ResultsTeaser />
      <SocialProof />
      <ShopPreview />
      <InstagramWall />
      <PositioningGrid />
      <FinalCTA />
    </>
  );
}

/* ---------- 1. Hero ---------- */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden bg-dark-surface">
      {/* Curtain */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-30 h-1/2 bg-dark-surface origin-top transition-transform duration-[1600ms] ease-[cubic-bezier(.25,.1,0,1)] ${loaded ? "-translate-y-full" : "translate-y-0"}`} />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 bg-dark-surface origin-bottom transition-transform duration-[1600ms] ease-[cubic-bezier(.25,.1,0,1)] ${loaded ? "translate-y-full" : "translate-y-0"}`} />

      {/* Background image (placeholder for video) */}
      <div className="absolute inset-0">
        <video
          src="/media/reels/spa-experience.mp4"
          className={`h-full w-full object-cover transition-opacity duration-[1800ms] ${loaded ? "opacity-60" : "opacity-0"} ken-burns`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 gradient-hero-overlay" />
      </div>

      {/* Wordmark */}
      <div className={`absolute top-28 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: loaded ? "600ms" : "0ms" }}>
        <div className="flex flex-col items-center gap-4">
          <BrandLogo
            imageClassName="h-24 lg:h-28 rounded-[28px] shadow-[0_28px_60px_-28px_rgba(201,169,110,0.65)]"
            labelClassName="text-gold"
          />
          <span className="font-accent text-[10px] tracking-[0.5em] uppercase text-gold">A Sanctuary in Wuse, Abuja</span>
        </div>
      </div>

      {/* Floating cards */}
      <FloatingCards loaded={loaded} />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <h1
            className={`font-display italic text-hero text-ivory transition-all duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: loaded ? "1000ms" : "0ms" }}
          >
            Luxury Skin & <br />
            <span className="text-gradient-gold">Wellness</span> Redefined.
          </h1>
          <p
            className={`mt-8 max-w-xl text-subhead text-ivory/75 font-body font-light transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: loaded ? "1800ms" : "0ms" }}
          >
            Advanced laser aesthetics, transformative skincare, and elite wellness rituals — crafted exclusively for discerning Abuja clients.
          </p>
          <div className={`mt-12 flex flex-wrap gap-4 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: loaded ? "2400ms" : "0ms" }}>
            <LuxLink to="/book" variant="primary">
              Book Consultation <ArrowRight size={16} />
            </LuxLink>
            <LuxLink to="/services" variant="secondary">
              Explore Treatments
            </LuxLink>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: loaded ? "3000ms" : "0ms" }}>
        <div className="glass-dark border-x-0 border-b-0 py-4 overflow-hidden">
          <div className="marquee marquee-pause flex gap-16 whitespace-nowrap font-accent text-[11px] tracking-[0.3em] uppercase text-gold-light/90">
            {[...Array(2)].flatMap((_, i) =>
              [
                "★ 4.6 Google Rating",
                "500+ Transformations",
                "Certified Laser Specialists",
                "Hygienic Luxury Environment",
                "NGN-Friendly Pricing",
                "Discreet & Confidential",
              ].map((t, j) => (
                <span key={`${i}-${j}`} className="flex items-center gap-3">
                  <span className="text-gold">✦</span> {t}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-3 pointer-events-none">
        <span className="font-accent text-[10px] tracking-[0.4em] uppercase text-ivory/60">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent float-y" />
      </div>
    </section>
  );
}

function FloatingCards({ loaded }: { loaded: boolean }) {
  const cards = [
    { name: "Chisom O.", text: "It felt like royalty.", pos: "top-[28%] right-[5%] lg:right-[8%]" },
    { name: "Fatima A.", text: "My skin has never looked better.", pos: "bottom-[28%] right-[10%] hidden md:block" },
    { name: "Blessing E.", text: "A calm, refreshing sanctuary.", pos: "top-[55%] right-[2%] hidden xl:block" },
  ];
  return (
    <>
      {cards.map((c, i) => (
        <div
          key={c.name}
          className={`absolute z-20 max-w-[240px] glass-light rounded-2xl p-5 float-y transition-all duration-1000 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} ${c.pos}`}
          style={{
            transitionDelay: loaded ? `${3400 + i * 250}ms` : "0ms",
            animationDelay: `${i * 1.5}s`,
          }}
        >
          <div className="flex gap-0.5 text-gold mb-3">
            {[...Array(5)].map((_, k) => <Star key={k} size={12} fill="currentColor" />)}
          </div>
          <p className="font-display italic text-ivory text-base leading-snug">"{c.text}"</p>
          <p className="mt-3 font-accent text-[10px] tracking-[0.25em] uppercase text-gold-light">— {c.name}</p>
        </div>
      ))}
    </>
  );
}

/* ---------- 2. Brand statement ---------- */
function BrandStatement() {
  return (
    <section className="bg-ink text-ivory py-32 lg:py-40 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <p className="font-display italic text-display text-ivory leading-tight">
            Where every treatment is a ritual,<br /> and every client is royalty.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-16 mx-auto max-w-md gold-line origin-left" />
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            {[
              { n: "500+", l: "Transformations" },
              { n: "6+", l: "Years of Excellence" },
              { n: "4.6★", l: "Client Rating" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display italic text-4xl lg:text-6xl text-gold">{s.n}</div>
                <div className="mt-3 font-accent text-[10px] lg:text-[11px] tracking-[0.3em] uppercase text-ivory/60">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 3. Services preview ---------- */
function ServicesPreview() {
  const featured = SERVICES.slice(0, 6);
  return (
    <section className="bg-ivory py-28 lg:py-36 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <Reveal>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Our Treatments</span>
            <h2 className="mt-4 font-display italic text-display text-ink max-w-2xl">
              A treatment menu crafted for transformation.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <Link to="/services" className="group inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-mocha hover:text-gold-deep transition-colors">
              View all 16 treatments <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ service }: { service: typeof SERVICES[number] }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group block relative overflow-hidden rounded-3xl bg-cream hover-lift"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(.25,.1,0,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-ivory">
        <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold">{service.category}</span>
        <h3 className="mt-2 font-display italic text-2xl lg:text-3xl">{service.name}</h3>
        <div className="mt-2 h-px w-12 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        <p className="mt-4 text-sm text-ivory/75 line-clamp-2">{service.shortDesc}</p>
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-ivory/70">
          <span>⏱ {service.duration}</span>
          <span className="text-gold-light">From {formatNGN(service.priceFrom)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- 4. Results teaser ---------- */
function ResultsTeaser() {
  return (
    <section className="bg-dark-surface text-ivory py-28 lg:py-36 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Real Results</span>
          <h2 className="mt-4 font-display italic text-display">
            Transformations that <span className="text-gradient-gold">speak quietly</span>, but unmistakably.
          </h2>
          <p className="mt-6 text-ivory/70 max-w-md text-subhead font-light">
            Hundreds of Abuja clients have stepped into Loofah Spa with a concern and walked out with renewed confidence. Slide to see real results from our clinical archive.
          </p>
          <div className="mt-10">
            <LuxLink to="/results" variant="secondary">
              See All Transformations <ArrowRight size={14} />
            </LuxLink>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <BeforeAfterSlider
            before="https://images.unsplash.com/photo-1581585504225-bb6c6cb27cf6?auto=format&fit=crop&w=900&q=80"
            after="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl select-none touch-none cursor-ew-resize"
      onMouseDown={(e) => { dragging.current = true; setFromX(e.clientX); }}
      onMouseMove={(e) => dragging.current && setFromX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => setFromX(e.touches[0].clientX)}
      onTouchMove={(e) => setFromX(e.touches[0].clientX)}
    >
      <img src={after} alt="After treatment" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Before treatment" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      {/* labels */}
      <span className="absolute top-4 left-4 glass-dark px-3 py-1.5 rounded-full font-accent text-[10px] tracking-[0.3em] uppercase text-ivory">Before</span>
      <span className="absolute top-4 right-4 glass-dark px-3 py-1.5 rounded-full font-accent text-[10px] tracking-[0.3em] uppercase text-gold-light">After</span>
      {/* handle */}
      <div className="absolute top-0 bottom-0 w-px bg-gold pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-[0_0_30px_rgba(201,169,110,0.7)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1714" strokeWidth="2.5">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------- 5. Social proof ---------- */
function SocialProof() {
  const reviews = [
    { name: "Adaeze M.", text: "The best self-care investment I've made in Abuja.", rating: 5, treatment: "Hydra Glow Facial" },
    { name: "Tunde A.", text: "Professional, clean, and the results speak for themselves.", rating: 5, treatment: "Laser Hair Removal" },
    { name: "Ngozi I.", text: "Felt like a private retreat. I'll be back.", rating: 5, treatment: "Wellness Massage" },
    { name: "Kemi O.", text: "My acne scars are visibly faded. So grateful.", rating: 5, treatment: "Microneedling" },
    { name: "Ibrahim K.", text: "The IV drip lounge alone is worth it.", rating: 5, treatment: "IV Therapy" },
  ];
  return (
    <section className="bg-cream py-28 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <Reveal>
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Loved by Abuja</span>
          <h2 className="mt-4 font-display italic text-display text-ink">
            Voices from the sanctuary.
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 overflow-hidden">
        <div className="marquee flex gap-6 whitespace-nowrap">
          {[...reviews, ...reviews, ...reviews].map((r, i) => (
            <div key={i} className="inline-flex flex-col w-[340px] whitespace-normal bg-ivory rounded-3xl p-7 border border-nude/40">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 ring-2 ring-gold flex items-center justify-center font-accent text-gold-deep text-sm">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-body text-sm text-ink">{r.name}</div>
                  <div className="flex gap-0.5 text-gold">{[...Array(r.rating)].map((_, k) => <Star key={k} size={11} fill="currentColor" />)}</div>
                </div>
              </div>
              <p className="font-display italic text-lg text-ink leading-snug">"{r.text}"</p>
              <p className="mt-4 font-accent text-[10px] tracking-[0.25em] uppercase text-gold-deep">{r.treatment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="font-display italic text-2xl text-mocha max-w-2xl mx-auto">
          "The best self-care investment I've made in Abuja."
        </p>
        <p className="mt-3 font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">— Adaeze M., verified client</p>
      </div>
    </section>
  );
}

/* ---------- 6. Positioning grid ---------- */
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
    <section className="relative bg-ink py-28 lg:py-36 px-6 lg:px-12 overflow-hidden">
      <Reveal>
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">FCT, Nigeria</span>
          <h2 className="mt-4 font-display italic text-display text-ivory">
            Abuja's future of <br />
            <span className="text-gradient-gold">luxury aesthetics.</span>
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
        {tiles.map((src, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 100}>
            <div className="glass-dark rounded-2xl p-6 flex items-center gap-4">
              <Icon size={22} className="text-gold flex-shrink-0" />
              <span className="font-body text-sm text-ivory/85">{label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- 7. Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="relative bg-cream py-28 lg:py-36 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Begin Your Ritual</span>
          <h2 className="mt-4 font-display italic text-display text-ink">
            Your transformation begins before <br className="hidden lg:block" /> you walk through the door.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-subhead text-ink/70 font-light">
            Book a private consultation with one of our certified specialists. We'll design a treatment plan made entirely for you.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
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
