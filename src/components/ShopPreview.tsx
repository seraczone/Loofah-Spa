import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ShopProductRecord } from "@/lib/app-data";
import { fetchShopProducts } from "@/lib/app-store";
import { formatNGN } from "@/lib/services";
import { useCart } from "@/components/providers/CartProvider";
import { LuxButton, LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";

export function ShopPreview() {
  const [products, setProducts] = useState<ShopProductRecord[]>([]);
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const { addItem } = useCart();

  useEffect(() => {
    let alive = true;

    fetchShopProducts().then((result) => {
      if (!alive) return;
      setMode(result.mode);
      setProducts(result.products.filter((product) => product.featured).slice(0, 3));
    });

    return () => {
      alive = false;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-ivory px-6 py-24 lg:px-12 lg:py-28">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <Reveal>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">
              Skin Shelf
            </span>
            <h2 className="mt-4 font-display italic text-display text-ink max-w-2xl">
              Take the sanctuary home.
            </h2>
            <p className="mt-5 max-w-xl text-ink/70">
              Clinic-picked essentials for glow maintenance between appointments.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-gold/30 px-4 py-2 text-[10px] tracking-[0.26em] uppercase text-gold-deep">
                {mode === "supabase" ? "Live inventory" : "Local preview"}
              </span>
              <LuxLink to="/shop" variant="ghost">
                Shop All <ArrowRight size={14} />
              </LuxLink>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 90}>
              <article className="overflow-hidden rounded-3xl border border-nude/50 bg-cream hover-lift">
                <div className="aspect-[4/4.8] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">
                        {product.category}
                      </div>
                      <h3 className="mt-2 font-heading text-2xl text-ink">{product.name}</h3>
                    </div>
                    <div className="rounded-full bg-ivory px-3 py-2 text-xs text-ink/65">
                      {product.inventory_count} left
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-ink/65">{product.subtitle}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-sm text-ink">{formatNGN(product.price_ngn)}</div>
                      {product.compare_at_ngn != null ? (
                        <div className="text-xs text-ink/45 line-through">
                          {formatNGN(product.compare_at_ngn)}
                        </div>
                      ) : null}
                    </div>
                    <LuxButton
                      variant="primary"
                      className="!px-5 !py-3 !text-[10px]"
                      onClick={() => addItem(product, 1)}
                    >
                      <ShoppingBag size={14} />
                      Add
                    </LuxButton>
                  </div>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-gold-deep hover:text-gold"
                  >
                    View in shop <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
