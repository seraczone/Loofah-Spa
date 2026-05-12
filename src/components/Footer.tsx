import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE } from "@/lib/site";

const COLS = [
  {
    title: "Treatments",
    links: [
      { label: "Laser Hair Removal", to: "/services/laser-hair-removal" },
      { label: "Hydra Glow Facial", to: "/services/hydra-glow-facial" },
      { label: "Chemical Peels", to: "/services/chemical-peels" },
      { label: "Microneedling", to: "/services/microneedling" },
      { label: "Botox", to: "/services/botox" },
      { label: "IV Therapy", to: "/services/iv-therapy" },
    ],
  },
  {
    title: "Loofah",
    links: [
      { label: "About", to: "/about" },
      { label: "Shop", to: "/shop" },
      { label: "Membership", to: "/membership" },
      { label: "AI Consultation", to: "/consultation" },
      { label: "Results", to: "/results" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-dark-surface text-dark-text">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-4 lg:px-12">
        <div>
          <BrandLogo showLocation={false} imageClassName="h-20 rounded-2xl" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-dark-text/70">
            Where science meets serenity. Abuja&apos;s most luxurious skin, laser and wellness sanctuary.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold/30 p-2 text-gold transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              <Instagram size={16} />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold/30 p-2 text-gold transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>

        {COLS.map((column) => (
          <div key={column.title}>
            <h4 className="mb-6 font-accent text-[11px] uppercase tracking-[0.3em] text-gold">
              {column.title}
            </h4>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-dark-text/75 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-6 font-accent text-[11px] uppercase tracking-[0.3em] text-gold">Visit</h4>
          <ul className="space-y-4 text-sm text-dark-text/75">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>{SITE.address.full}</span>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {SITE.hours.map((hour) => (
                  <div key={hour.day}>
                    {hour.day}: {hour.time}
                  </div>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" />
              {SITE.phone}
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" />
              {SITE.email}
            </li>
          </ul>
          <Link to="/visit" className="mt-8 block overflow-hidden rounded-3xl border border-gold/15">
            <div className="relative aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="font-accent text-[10px] uppercase tracking-[0.26em] text-gold-light">Map</div>
                <div className="mt-2 font-heading text-lg text-ivory">Get directions to Wuse</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 px-6 py-6 text-xs text-dark-text/55 md:flex-row lg:px-12">
          <div>(c) {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-gold">
              Terms of Service
            </Link>
            <span>Made in Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
