import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Heart } from "lucide-react";
import { SERVICES, formatNGN } from "@/lib/services";
import { Reveal } from "@/components/Reveal";
import { LuxLink } from "@/components/LuxButton";
import { wa } from "@/lib/site";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    if (!s) return { meta: [{ title: "Treatment — Loofah Spa Abuja" }] };
    return {
      meta: [
        { title: `${s.name} — Loofah Spa Abuja` },
        { name: "description", content: s.shortDesc },
        { property: "og:title", content: `${s.name} in Abuja — Loofah Spa` },
        { property: "og:description", content: s.shortDesc },
        { property: "og:image", content: s.image },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-display italic text-3xl text-mocha">Treatment not found</p>
        <Link to="/services" className="mt-4 inline-block text-gold-deep underline">View all treatments</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8">{error.message}</div>,
  component: ServicePage,
});

function ServicePage() {
  const { service: s } = Route.useLoaderData();
  const related = SERVICES.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[560px] bg-ink overflow-hidden">
        <img src={s.image} alt={s.name} className="absolute inset-0 h-full w-full object-cover opacity-55 ken-burns" />
        <div className="absolute inset-0 gradient-hero-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">{s.category}</span>
          <h1 className="mt-4 font-display italic text-hero text-ivory max-w-3xl">{s.name}</h1>
          <p className="mt-6 max-w-xl text-subhead text-ivory/80 font-light">{s.shortDesc}</p>
          <div className="mt-8 flex flex-wrap gap-4 items-center text-ivory/80 text-sm font-mono">
            <span className="flex items-center gap-2"><Clock size={14} className="text-gold" /> {s.duration}</span>
            <span className="flex items-center gap-2"><Heart size={14} className="text-gold" /> {s.downtime} downtime</span>
            <span className="text-gold-light">From {formatNGN(s.priceFrom)}</span>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-6 lg:px-12 bg-ivory">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">The treatment</span>
            <h2 className="mt-4 font-display italic text-display text-ink">What is {s.name}?</h2>
            <p className="mt-6 text-lg text-ink/75 font-light leading-relaxed">{s.longDesc}</p>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 lg:px-12 bg-cream">
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <h2 className="font-display italic text-display text-ink text-center mb-14">Key benefits</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {s.benefits.map((b: string, i: number) => (
              <Reveal key={b} delay={i * 80}>
                <div className="bg-ivory rounded-2xl p-6 flex items-start gap-4 border border-nude/40">
                  <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-gold-deep" />
                  </div>
                  <p className="text-ink/85">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 lg:px-12 bg-ivory">
        <div className="max-w-[1100px] mx-auto">
          <Reveal>
            <h2 className="font-display italic text-display text-ink text-center mb-14">The ritual</h2>
          </Reveal>
          <ol className="space-y-6">
            {s.steps.map((step: {title:string;body:string}, i: number) => (
              <Reveal key={step.title} delay={i * 100}>
                <li className="flex gap-6 lg:gap-8 items-start">
                  <div className="font-display italic text-5xl lg:text-6xl text-gold leading-none w-16 flex-shrink-0">0{i + 1}</div>
                  <div className="flex-1 border-b border-nude/50 pb-6">
                    <h3 className="font-heading text-xl text-ink">{step.title}</h3>
                    <p className="mt-2 text-ink/70">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 lg:px-12 bg-cream">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="font-display italic text-display text-ink text-center mb-12">Frequently asked</h2>
          </Reveal>
          <div className="space-y-3">
            {s.faqs.map((f: {q:string;a:string}, i: number) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group bg-ivory rounded-2xl border border-nude/40 overflow-hidden">
                  <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between font-heading text-lg text-ink">
                    {f.q}
                    <span className="text-gold-deep text-2xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-ink/70">{f.a}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA + related */}
      <section className="py-24 px-6 lg:px-12 bg-ink text-ivory">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-display italic text-display">Ready to begin?</h2>
          <p className="mt-4 text-ivory/70 max-w-md mx-auto">Book your private consultation. We'll confirm pricing tailored to you.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <LuxLink to="/book">Book {s.name} <ArrowRight size={14} /></LuxLink>
            <LuxLink to={wa(`Hi Loofah Spa! I'd like to know more about ${s.name}.`)} external variant="secondary">Ask on WhatsApp</LuxLink>
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-[1400px] mx-auto mt-24">
            <h3 className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-8 text-center">Related treatments</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to="/services/$slug" params={{ slug: r.slug }} className="group block bg-dark-card rounded-2xl overflow-hidden border border-gold/15 hover-lift">
                  <div className="aspect-[5/3] overflow-hidden">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold">{r.category}</span>
                    <h4 className="mt-2 font-display italic text-2xl text-ivory">{r.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
