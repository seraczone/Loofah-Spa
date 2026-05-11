import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "./index";
import { LuxLink } from "@/components/LuxButton";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Real Results — Before & After Transformations | Loofah Spa Abuja" },
      { name: "description", content: "Browse real before-and-after transformations from Loofah Spa Abuja clients across acne, pigmentation, hair removal, microneedling and more." },
      { property: "og:title", content: "Real Results — Loofah Spa Abuja" },
      { property: "og:description", content: "Slide through real client transformations." },
    ],
  }),
  component: ResultsPage,
});

const CATS = ["All", "Acne", "Pigmentation", "Hair Removal", "Skin Texture", "Anti-Aging"] as const;

const STORIES = [
  { name: "Adaeze M.", concern: "Acne", weeks: 8, treatment: "Acne Programme",
    before: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
    quote: "My skin is finally calm — and so am I." },
  { name: "Fatima A.", concern: "Pigmentation", weeks: 12, treatment: "Brightening Ritual",
    before: "https://images.unsplash.com/photo-1583241800698-9c2e3624f0b3?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1612870258635-a7e6db5e09c5?auto=format&fit=crop&w=800&q=80",
    quote: "The dark spots faded so beautifully." },
  { name: "Chisom O.", concern: "Hair Removal", weeks: 16, treatment: "Laser Hair Removal",
    before: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1581585504225-bb6c6cb27cf6?auto=format&fit=crop&w=800&q=80",
    quote: "Smoothest skin of my life." },
  { name: "Kemi O.", concern: "Skin Texture", weeks: 12, treatment: "Microneedling",
    before: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
    quote: "Pores look genuinely smaller." },
  { name: "Ngozi I.", concern: "Anti-Aging", weeks: 6, treatment: "Botox & Mesotherapy",
    before: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    quote: "I look rested, not 'done'." },
  { name: "Tunde A.", concern: "Acne", weeks: 8, treatment: "Chemical Peel Series",
    before: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1612870258635-a7e6db5e09c5?auto=format&fit=crop&w=800&q=80",
    quote: "Worth every naira." },
];

function ResultsPage() {
  const [active, setActive] = useState<(typeof CATS)[number]>("All");
  const list = active === "All" ? STORIES : STORIES.filter((s) => s.concern === active);

  return (
    <>
      <section className="bg-ink text-ivory pt-40 pb-20 px-6 lg:px-12 text-center">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Real Results</span>
        <h1 className="mt-4 font-display italic text-hero">
          Transformation, <br />
          <span className="text-gradient-gold">documented.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-subhead text-ivory/70 font-light">
          Drag the gold handle to see real before-and-after results from clients who chose Loofah Spa.
        </p>
      </section>

      <section className="bg-ivory py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-pill px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase font-body transition-all duration-500 border ${
                  active === c
                    ? "bg-ink text-ivory border-ink"
                    : "bg-transparent text-ink/70 border-nude hover:border-gold hover:text-gold-deep"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((s, i) => (
              <Reveal key={`${s.name}-${i}`} delay={i * 80}>
                <article className="bg-cream rounded-3xl overflow-hidden border border-nude/40">
                  <BeforeAfterSlider before={s.before} after={s.after} />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">{s.concern}</span>
                      <span className="font-mono text-xs text-ink/60">{s.weeks} weeks</span>
                    </div>
                    <p className="mt-3 font-display italic text-xl text-ink">"{s.quote}"</p>
                    <p className="mt-2 text-sm text-ink/70">{s.treatment} · {s.name}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <LuxLink to="/consultation">Get Your Personalised Plan</LuxLink>
          </div>
        </div>
      </section>
    </>
  );
}
