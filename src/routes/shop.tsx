import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { ShopProductRecord } from "@/lib/app-data";
import { fetchShopProducts } from "@/lib/app-store";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { formatNGN } from "@/lib/services";
import { LuxButton, LuxLink } from "@/components/LuxButton";
import { useCart } from "@/components/providers/CartProvider";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Skincare - Loofah Spa Abuja" },
      {
        name: "description",
        content:
          "Shop the Loofah Spa skincare shelf: cleansers, brightening formulas, recovery creams and broad-spectrum SPF.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<ShopProductRecord[]>([]);
  const [category, setCategory] = useState<string>("All");
  const { addItem, count, items } = useCart();

  useEffect(() => {
    let alive = true;
    fetchShopProducts().then((result) => {
      if (!alive) return;
      setProducts(result.products);
    });
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => ["All", ...SHOP_CATEGORIES], []);
  const filtered = category === "All" ? products : products.filter((product) => product.category === category);

  return (
    <section className="min-h-screen bg-ivory pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Storefront</span>
            <h1 className="mt-4 font-display italic text-display text-ink">The Loofah shelf edit.</h1>
            <p className="mt-4 max-w-2xl text-ink/70">
              Clinic-approved formulas for maintenance, barrier repair and everyday radiance between appointments.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LuxLink to="/cart" variant="ghost">
              Cart ({count}) <ArrowRight size={14} />
            </LuxLink>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-all ${
                category === item
                  ? "border-ink bg-ink text-ivory"
                  : "border-nude/60 bg-cream text-ink/70 hover:border-gold"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const cartQuantity = items.find((item) => item.slug === product.slug)?.quantity ?? 0;
            const isSoldOut = !product.in_stock || product.inventory_count <= 0;
            const stockReached = cartQuantity >= product.inventory_count;

            return (
              <article key={product.slug} className="overflow-hidden rounded-[30px] border border-nude/50 bg-cream">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">
                        {product.category}
                      </div>
                      <h2 className="mt-2 font-heading text-2xl text-ink">{product.name}</h2>
                    </div>
                    <span className="rounded-full bg-ivory px-3 py-2 text-xs text-ink/60">
                      {isSoldOut ? "Sold out" : `${product.inventory_count} in stock`}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink/65">{product.subtitle}</p>
                  <p className="mt-4 text-sm text-ink/58">{product.description}</p>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-mono text-lg text-ink">{formatNGN(product.price_ngn)}</div>
                      {product.compare_at_ngn != null ? (
                        <div className="text-xs text-ink/45 line-through">
                          {formatNGN(product.compare_at_ngn)}
                        </div>
                      ) : null}
                    </div>
                    <LuxButton
                      variant="primary"
                      className="!px-5 !py-3 !text-[10px]"
                      disabled={isSoldOut || stockReached}
                      onClick={() => {
                        if (isSoldOut) {
                          toast.error(`${product.name} is currently sold out.`);
                          return;
                        }
                        if (stockReached) {
                          toast.error(`Only ${product.inventory_count} unit(s) are available right now.`);
                          return;
                        }
                        addItem(product, 1);
                        toast.success(`${product.name} added to cart.`);
                      }}
                    >
                      <ShoppingBag size={14} />
                      {isSoldOut ? "Sold out" : stockReached ? "Cart limit reached" : "Add to cart"}
                    </LuxButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
