import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { LuxLink } from "./LuxButton";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { BrandLogo } from "@/components/BrandLogo";

const NAV = [
  { to: "/services", label: "Treatments" },
  { to: "/shop", label: "Shop" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
  { to: "/membership", label: "Membership" },
  { to: "/visit", label: "Visit" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { count } = useCart();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  // Most pages have a dark hero at the top; treat top-of-page as dark unless scrolled.
  const onDark = !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(.25,.1,0,1)] ${
        scrolled
          ? "bg-ivory/90 backdrop-blur-xl border-b border-nude/40 py-3 shadow-sm"
          : "bg-gradient-to-b from-ink/70 via-ink/30 to-transparent backdrop-blur-[2px] py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="group">
          <BrandLogo
            showLocation={false}
            imageClassName="h-[3.55rem] lg:h-[4rem] drop-shadow-[0_18px_45px_rgba(201,169,110,0.38)]"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-[12px] tracking-[0.22em] uppercase font-body font-medium transition-colors duration-500 hover:text-gold ${
                onDark ? "text-ivory" : "text-ink/80"
              }`}
              activeProps={{ className: "!text-gold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/cart"
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
              onDark
                ? "border-ivory/30 text-ivory hover:border-gold hover:text-gold"
                : "border-nude/50 text-ink hover:border-gold hover:text-gold-deep"
            }`}
            aria-label="Open cart"
          >
            <ShoppingBag size={17} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink">
                {count}
              </span>
            ) : null}
          </Link>
          <Link
            to={isAdmin ? "/admin" : "/auth"}
            className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[11px] uppercase tracking-[0.22em] transition-colors ${
              onDark
                ? "border-ivory/30 text-ivory hover:border-gold hover:text-gold"
                : "border-nude/50 text-ink hover:border-gold hover:text-gold-deep"
            }`}
          >
            <UserRound size={15} />
            {user ? (isAdmin ? "Admin" : "Account") : "Sign In"}
          </Link>
          <LuxLink to="/book" variant="primary" className="!py-3 !px-6 !text-[10px] whitespace-nowrap">
            Book Consultation
          </LuxLink>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden p-2 ${onDark ? "text-ivory" : "text-ink"}`}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] bg-ivory border-t border-nude/40 transition-all duration-500 ease-[cubic-bezier(.25,.1,0,1)] overflow-hidden ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-8 gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="font-display text-2xl text-ink/80 py-3 border-b border-nude/30"
              activeProps={{ className: "!text-gold-deep" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="font-display text-2xl text-ink/80 py-3 border-b border-nude/30"
            activeProps={{ className: "!text-gold-deep" }}
          >
            Cart ({count})
          </Link>
          <Link
            to={isAdmin ? "/admin" : "/auth"}
            className="font-display text-2xl text-ink/80 py-3 border-b border-nude/30"
            activeProps={{ className: "!text-gold-deep" }}
          >
            {user ? (isAdmin ? "Admin" : "Account") : "Sign In"}
          </Link>
          <div className="pt-6">
            <LuxLink to="/book" className="w-full">Book Consultation</LuxLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
