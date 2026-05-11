import { Link } from "@tanstack/react-router";
import { Calendar, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { wa } from "@/lib/site";

export function MobileBar() {
  const { count } = useCart();

  return (
    <>
      <Link
        to="/book"
        className="lg:hidden fixed bottom-4 left-4 right-36 z-40 bg-ink text-ivory rounded-pill py-4 flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md text-[12px] tracking-[0.22em] uppercase font-medium"
      >
        <Calendar size={16} className="text-gold" />
        Book Treatment
      </Link>

      <Link
        to="/cart"
        aria-label="Open cart"
        className="lg:hidden fixed bottom-4 right-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ivory text-ink shadow-2xl"
      >
        <ShoppingBag size={22} />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] text-ink">
            {count}
          </span>
        ) : null}
      </Link>

      <a
        href={wa("Hi Loofah Spa! I'd like to enquire about a treatment.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.45)] pulse-soft"
      >
        <MessageCircle size={26} />
      </a>
    </>
  );
}
