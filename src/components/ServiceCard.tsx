import { Link } from "@tanstack/react-router";
import type { Service } from "@/lib/services";
import { formatNGN } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="group relative block overflow-hidden rounded-3xl bg-cream hover-lift"
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
      <div className="absolute inset-x-0 bottom-0 p-6 text-ivory lg:p-8">
        <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold">{service.category}</span>
        <h3 className="mt-2 font-display text-2xl italic lg:text-3xl">{service.name}</h3>
        <div className="mt-2 h-px w-12 origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
        <p className="mt-4 line-clamp-2 text-sm text-ivory/75">{service.shortDesc}</p>
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ivory/70">
          <span>Time {service.duration}</span>
          <span className="text-gold-light">From {formatNGN(service.priceFrom)}</span>
        </div>
      </div>
    </Link>
  );
}
