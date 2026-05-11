import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { BrandLogo } from "@/components/BrandLogo";

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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 grid gap-12 lg:grid-cols-4">
        {/* Brand col */}
        <div>
          <BrandLogo imageClassName="h-20 rounded-2xl" labelClassName="text-gold" />
          <p className="mt-6 text-sm text-dark-text/70 leading-relaxed max-w-xs">
            Where science meets serenity. Abuja's most luxurious skin, laser & wellness sanctuary.
          </p>
          <div className="mt-8 flex gap-4">
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer"
               className="p-2 border border-gold/30 rounded-full text-gold hover:bg-gold hover:text-ink transition-all duration-500">
              <Instagram size={16} />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer"
               className="p-2 border border-gold/30 rounded-full text-gold hover:bg-gold hover:text-ink transition-all duration-500">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-6">{c.title}</h4>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-dark-text/75 hover:text-gold transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-6">Visit</h4>
          <ul className="space-y-4 text-sm text-dark-text/75">
            <li className="flex gap-3"><MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" /><span>{SITE.address.full}</span></li>
            <li className="flex gap-3"><Clock size={16} className="text-gold flex-shrink-0 mt-0.5" />
              <span>
                {SITE.hours.map((h) => <div key={h.day}>{h.day}: {h.time}</div>)}
              </span>
            </li>
            <li className="flex gap-3"><Phone size={16} className="text-gold flex-shrink-0 mt-0.5" />{SITE.phone}</li>
            <li className="flex gap-3"><Mail size={16} className="text-gold flex-shrink-0 mt-0.5" />{SITE.email}</li>
          </ul>
          <Link
            to="/visit"
            className="mt-8 block overflow-hidden rounded-3xl border border-gold/15"
          >
            <div className="relative aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="font-accent text-[10px] tracking-[0.26em] uppercase text-gold-light">Map</div>
                <div className="mt-2 font-heading text-lg text-ivory">Get directions to Wuse</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-dark-text/55">
          <div>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-gold">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-gold">Terms of Service</Link>
            <span>Made in Nigeria 🇳🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
