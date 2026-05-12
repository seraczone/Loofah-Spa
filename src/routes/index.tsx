import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { DeferredSection } from "@/components/home/DeferredSection";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { SERVICES } from "@/lib/services";

const LazyHomeResultsBlock = lazy(() => import("@/components/home/HomeResultsBlock"));
const LazyHomeClosingBlock = lazy(() => import("@/components/home/HomeClosingBlock"));
const LazyShopPreview = lazy(() =>
  import("@/components/ShopPreview").then((module) => ({ default: module.ShopPreview })),
);
const LazyInstagramWall = lazy(() =>
  import("@/components/InstagramWall").then((module) => ({ default: module.InstagramWall })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loofah Spa Abuja - Luxury Skin, Laser & Wellness in Wuse" },
      {
        name: "description",
        content:
          "Abuja's most luxurious skin, laser & wellness destination on Mombasa Street, Wuse. Book hydra facials, laser hair removal, microneedling and more.",
      },
      { property: "og:title", content: "Loofah Spa Abuja - Luxury Skin, Laser & Wellness" },
      {
        property: "og:description",
        content: "Where science meets serenity. Book your private consultation in Wuse, Abuja.",
      },
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
      <DeferredSection
        fallback={
          <SectionPlaceholder
            tone="dark"
            title="Loading transformations"
            copy="Preparing results and client stories."
          />
        }
      >
        <LazyHomeResultsBlock />
      </DeferredSection>
      <DeferredSection
        rootMargin="320px 0px"
        fallback={
          <SectionPlaceholder
            title="Loading the beauty shelf"
            copy="Curated home-care picks are on the way."
          />
        }
      >
        <LazyShopPreview />
      </DeferredSection>
      <DeferredSection
        rootMargin="320px 0px"
        fallback={
          <SectionPlaceholder
            tone="dark"
            title="Loading the Instagram wall"
            copy="Preparing reel previews from Loofah."
          />
        }
      >
        <LazyInstagramWall />
      </DeferredSection>
      <DeferredSection
        rootMargin="320px 0px"
        fallback={
          <SectionPlaceholder
            tone="dark"
            title="Loading the closing experience"
            copy="Bringing in the final atmosphere and booking prompt."
          />
        }
      >
        <LazyHomeClosingBlock />
      </DeferredSection>
    </>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="relative h-screen min-h-[620px] w-full overflow-hidden bg-dark-surface lg:min-h-[680px]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 h-1/2 origin-top bg-dark-surface transition-transform duration-[1600ms] ease-[cubic-bezier(.25,.1,0,1)] ${
          loaded ? "-translate-y-full" : "translate-y-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 origin-bottom bg-dark-surface transition-transform duration-[1600ms] ease-[cubic-bezier(.25,.1,0,1)] ${
          loaded ? "translate-y-full" : "translate-y-0"
        }`}
      />

      <div className="absolute inset-0">
        <video
          src="/media/reels/spa-experience.mp4"
          className={`ken-burns h-full w-full object-cover transition-opacity duration-[1800ms] ${
            loaded ? "opacity-60" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="gradient-hero-overlay absolute inset-0" />
      </div>

      <FloatingCards loaded={loaded} />

      <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 lg:px-12">
        <div className="max-w-3xl">
          <h1
            className={`font-display text-hero italic text-ivory transition-all duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: loaded ? "1000ms" : "0ms" }}
          >
            Luxury Skin & <br />
            <span className="text-gradient-gold">Wellness</span> Redefined.
          </h1>
          <p
            className={`mt-8 max-w-xl font-body font-light text-subhead text-ivory/75 transition-all duration-1000 ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: loaded ? "1800ms" : "0ms" }}
          >
            Advanced laser aesthetics, transformative skincare, and elite wellness rituals - crafted exclusively for
            discerning Abuja clients.
          </p>
          <div
            className={`mt-12 flex flex-wrap gap-4 transition-all duration-1000 ${
              loaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: loaded ? "2400ms" : "0ms" }}
          >
            <LuxLink to="/book" variant="primary">
              Book Consultation <ArrowRight size={16} />
            </LuxLink>
            <LuxLink to="/services" variant="secondary">
              Explore Treatments
            </LuxLink>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: loaded ? "3000ms" : "0ms" }}
      >
        <div className="glass-dark overflow-hidden border-b-0 border-x-0 py-4">
          <div className="marquee marquee-pause flex gap-16 whitespace-nowrap font-accent text-[11px] uppercase tracking-[0.3em] text-gold-light/90">
            {[...Array(2)].flatMap((_, index) =>
              [
                "* 4.6 Google Rating",
                "500+ Transformations",
                "Certified Laser Specialists",
                "Hygienic Luxury Environment",
                "NGN-Friendly Pricing",
                "Discreet & Confidential",
              ].map((label, labelIndex) => (
                <span key={`${index}-${labelIndex}`} className="flex items-center gap-3">
                  <span className="text-gold">*</span> {label}
                </span>
              )),
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="font-accent text-[10px] uppercase tracking-[0.4em] text-ivory/60">Scroll</span>
        <div className="float-y h-12 w-px bg-gradient-to-b from-gold to-transparent" />
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
      {cards.map((card, index) => (
        <div
          key={card.name}
          className={`glass-light float-y absolute z-20 max-w-[240px] rounded-2xl p-5 transition-all duration-1000 ${
            loaded ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          } ${card.pos}`}
          style={{
            transitionDelay: loaded ? `${3400 + index * 250}ms` : "0ms",
            animationDelay: `${index * 1.5}s`,
          }}
        >
          <div className="mb-3 flex gap-0.5 text-gold">
            {[...Array(5)].map((_, starIndex) => (
              <Star key={starIndex} size={12} fill="currentColor" />
            ))}
          </div>
          <p className="font-display text-base italic leading-snug text-ivory">"{card.text}"</p>
          <p className="mt-3 font-accent text-[10px] uppercase tracking-[0.25em] text-gold-light">- {card.name}</p>
        </div>
      ))}
    </>
  );
}

function BrandStatement() {
  return (
    <section className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="font-display text-display italic leading-tight text-ivory">
            Where every treatment is a ritual,<br /> and every client is royalty.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="gold-line mx-auto mt-16 max-w-md origin-left" />
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            {[
              { n: "500+", l: "Transformations" },
              { n: "6+", l: "Years of Excellence" },
              { n: "4.6*", l: "Client Rating" },
            ].map((stat) => (
              <div key={stat.l}>
                <div className="font-display text-4xl italic text-gold lg:text-6xl">{stat.n}</div>
                <div className="mt-3 font-accent text-[10px] uppercase tracking-[0.3em] text-ivory/60 lg:text-[11px]">
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const featured = SERVICES.slice(0, 6);

  return (
    <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold-deep">Our Treatments</span>
            <h2 className="mt-4 max-w-2xl font-display text-display italic text-ink">
              A treatment menu crafted for transformation.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-mocha transition-colors hover:text-gold-deep"
            >
              View all 16 treatments <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featured.map((service, index) => (
            <Reveal key={service.slug} delay={index * 80}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionPlaceholder({
  title,
  copy,
  tone = "light",
}: {
  title: string;
  copy: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <section className={`${dark ? "bg-dark-surface text-ivory" : "bg-ivory text-ink"} px-6 py-20 lg:px-12 lg:py-24`}>
      <div
        className={`mx-auto max-w-[1400px] rounded-[32px] border px-8 py-12 ${
          dark ? "border-gold/12 bg-dark-card" : "border-nude/45 bg-cream"
        }`}
      >
        <div
          className={`font-accent text-[10px] uppercase tracking-[0.28em] ${
            dark ? "text-gold-light" : "text-gold-deep"
          }`}
        >
          Optimized loading
        </div>
        <h2 className="mt-4 font-display text-3xl italic">{title}</h2>
        <p className={`mt-3 max-w-xl text-sm ${dark ? "text-ivory/68" : "text-ink/62"}`}>{copy}</p>
      </div>
    </section>
  );
}
