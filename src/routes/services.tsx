import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SERVICES, CATEGORIES, type Category } from "@/lib/services";
import { ServiceCard } from "./index";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "All Treatments — Loofah Spa Abuja" },
      { name: "description", content: "Browse 16+ luxury skin, laser, injectables, hair, body and wellness treatments at Loofah Spa Abuja." },
      { property: "og:title", content: "Treatments — Loofah Spa Abuja" },
      { property: "og:description", content: "Laser, skincare, injectables, hair, body & wellness — performed by certified specialists in Wuse, Abuja." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const list = active === "All" ? SERVICES : SERVICES.filter((s) => s.category === (active as Category));

  return (
    <>
      <section className="bg-ink text-ivory pt-40 pb-20 px-6 lg:px-12 text-center">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Treatment Menu</span>
        <h1 className="mt-4 font-display italic text-hero">A ritual for every concern.</h1>
        <p className="mt-6 max-w-2xl mx-auto text-subhead text-ivory/70 font-light">
          Sixteen signature treatments performed in our private suites by certified Abuja specialists.
        </p>
      </section>

      <section className="bg-ivory py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {CATEGORIES.map((c) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {list.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
