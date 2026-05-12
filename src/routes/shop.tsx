import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Droplets, ShieldPlus, ShoppingBag, Sparkles, SunMedium } from "lucide-react";
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
  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 3), [products]);
  const heroSpotlight = featured[0] ?? products[0] ?? null;
  const inventoryCount = useMemo(
    () => products.reduce((total, product) => total + Math.max(0, product.inventory_count), 0),
    [products],
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f0e4_0%,#f6efe7_32%,#fbf6f0_100%)] px-6 pt-32 pb-24 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,110,0.14),transparent_30%),radial-gradient(circle_at_left,rgba(28,20,13,0.06),transparent_26%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="overflow-hidden rounded-[36px] border border-gold/15 bg-[linear-gradient(145deg,#16110d_0%,#251a12_60%,#2f2217_100%)] text-ivory shadow-[0_38px_120px_-52px_rgba(21,15,10,0.62)]">
            <div className="border-b border-gold/12 px-6 py-6 sm:px-8 lg:px-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gold/20 bg-ivory/5 px-4 py-2 font-accent text-[10px] uppercase tracking-[0.32em] text-gold-light">
                  Temporary shelf edit
                </span>
                <span className="rounded-full border border-ivory/10 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-ivory/68">
                  Curated while the Loofah line is being prepared
                </span>
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(3.2rem,7vw,5.8rem)] italic leading-[0.95] text-ivory">
                Beauty, but
                <br />
                with clinic polish.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ivory/70 sm:text-lg">
                A richer placeholder storefront for the season: glow maintenance, barrier support and sun-safe finishers
                chosen to still feel luxurious until the branded product range lands.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <LuxLink to="/cart">
                  Open cart ({count}) <ArrowRight size={14} />
                </LuxLink>
                <LuxLink to="/consultation" variant="ghost">
                  Build my routine
                </LuxLink>
              </div>
            </div>

            <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:px-10 lg:py-8">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <BeautyCue
                  icon={Droplets}
                  title="Prep"
                  body="Soft cleansers and enzyme textures that reset the skin without stealing comfort."
                />
                <BeautyCue
                  icon={Sparkles}
                  title="Treat"
                  body="Brightening and resurfacing essentials chosen for visible glow between appointments."
                />
                <BeautyCue
                  icon={SunMedium}
                  title="Protect"
                  body="Humidity-friendly SPF and recovery creams that keep Abuja skin routines consistent."
                />
              </div>

              <div className="rounded-[30px] border border-gold/15 bg-ivory/6 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-light">Shelf Snapshot</div>
                    <div className="mt-2 text-2xl font-heading text-ivory">{products.length || 6} beauty essentials</div>
                  </div>
                  <div className="rounded-full border border-ivory/10 bg-ivory/8 px-3 py-2 text-xs text-ivory/70">
                    {inventoryCount} units live
                  </div>
                </div>

                {heroSpotlight ? (
                  <div className="mt-5 overflow-hidden rounded-[28px] border border-gold/10 bg-ivory/5">
                    <div className="aspect-[5/4] overflow-hidden">
                      <img
                        src={heroSpotlight.image_url}
                        alt={heroSpotlight.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-light">
                            {heroSpotlight.category}
                          </div>
                          <h2 className="mt-2 font-heading text-2xl text-ivory">{heroSpotlight.name}</h2>
                        </div>
                        <span className="rounded-full border border-gold/15 bg-ivory/8 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-ivory/72">
                          Featured
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-ivory/68">{heroSpotlight.description}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-gold/12 bg-dark-surface text-ivory shadow-[0_38px_120px_-54px_rgba(12,8,5,0.52)]">
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-58"
              src="/media/reels/glowing-skin-consistency.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,11,8,0.18),rgba(14,11,8,0.72)_62%,rgba(14,11,8,0.92)_100%)]" />
            <div className="relative flex h-full min-h-[560px] flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div className="max-w-md">
                <span className="rounded-full border border-gold/18 bg-ivory/6 px-4 py-2 font-accent text-[10px] uppercase tracking-[0.32em] text-gold-light">
                  Beauty Film
                </span>
                <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.3rem)] italic leading-[0.95] text-ivory">
                  Consistency
                  <br />
                  should still look
                  <br />
                  expensive.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-ivory/72">
                  Until your branded line is ready, the shop should still feel like Loofah: warm, elevated, skin-first
                  and visually composed.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {featured.slice(0, 2).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-[26px] border border-ivory/10 bg-ivory/8 p-3 backdrop-blur-md"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-20 w-20 rounded-[20px] object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-accent text-[10px] uppercase tracking-[0.26em] text-gold-light">
                        {product.category}
                      </div>
                      <div className="mt-1 truncate font-heading text-lg text-ivory">{product.name}</div>
                      <div className="mt-1 text-sm text-ivory/64">{formatNGN(product.price_ngn)}</div>
                    </div>
                  </div>
                ))}

                <div className="rounded-[26px] border border-gold/12 bg-[linear-gradient(135deg,rgba(201,169,110,0.18),rgba(255,255,255,0.06))] p-5 sm:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-light">What stays</div>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-ivory/72">
                        The product photography is temporary, but the layout, tone and customer flow can already feel
                        refined. This gives the shop a beauty-editorial presence now and leaves room for an easy product
                        swap later.
                      </p>
                    </div>
                    <ShieldPlus className="shrink-0 text-gold-light" size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-nude/55 bg-cream/85 p-6 shadow-[0_20px_80px_-52px_rgba(45,31,19,0.35)] sm:p-7">
            <div className="font-accent text-[10px] uppercase tracking-[0.32em] text-gold-deep">Beauty Direction</div>
            <h3 className="mt-3 font-heading text-3xl text-ink">Warm neutrals, polished textures, visible calm.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/66">
              The shop now reads less like a plain catalogue and more like a curated shelf. Later, when your branded
              products are ready, the visuals can be swapped without rebuilding the experience.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricTile label="Featured" value={`${featured.length || 3}`} note="editorial picks" />
            <MetricTile label="Categories" value={`${categories.length - 1 || 6}`} note="routine steps" />
            <MetricTile label="Stock live" value={`${inventoryCount}`} note="cart-aware units" />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-all ${
                category === item
                  ? "border-ink bg-ink text-ivory shadow-[0_14px_36px_-24px_rgba(25,18,12,0.55)]"
                  : "border-nude/60 bg-cream/88 text-ink/70 hover:border-gold hover:bg-ivory"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {featured.length > 0 ? (
          <div className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">Shelf Highlights</span>
                <h3 className="mt-3 font-heading text-4xl text-ink">A little more beauty before the full brand drop.</h3>
              </div>
              <p className="max-w-xl text-sm leading-7 text-ink/64">
                Featured cards keep the shop feeling composed now, then convert easily into your real product spotlight
                section later.
              </p>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-3">
              {featured.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">Current Shelf</span>
            <h3 className="mt-3 font-heading text-4xl text-ink">
              {category === "All" ? "Shop the full edit." : `${category} picks for the routine.`}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-nude/60 bg-cream/88 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink/58">
              {filtered.length} products shown
            </div>
            <LuxLink to="/cart" variant="ghost">
              Cart ({count}) <ArrowRight size={14} />
            </LuxLink>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const cartQuantity = items.find((item) => item.slug === product.slug)?.quantity ?? 0;
            const isSoldOut = !product.in_stock || product.inventory_count <= 0;
            const stockReached = cartQuantity >= product.inventory_count;

            return (
              <article
                key={product.slug}
                className="group overflow-hidden rounded-[32px] border border-nude/55 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(248,240,231,0.96))] shadow-[0_28px_90px_-58px_rgba(39,28,18,0.42)] transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(20,14,10,0.08)_64%,rgba(20,14,10,0.24)_100%)]" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-ivory/60 bg-ivory/78 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-ink/72 backdrop-blur-md">
                      {product.category}
                    </span>
                    {product.featured ? (
                      <span className="rounded-full border border-gold/20 bg-gold/12 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-gold-deep backdrop-blur-md">
                        Editorial pick
                      </span>
                    ) : null}
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full border border-ivory/40 bg-ivory/74 px-3 py-2 text-xs text-ink/68 backdrop-blur-md">
                    {isSoldOut ? "Sold out" : `${product.inventory_count} in stock`}
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-[1.75rem] leading-tight text-ink">{product.name}</h2>
                      <p className="mt-3 text-sm leading-6 text-ink/66">{product.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-ivory px-3 py-2 font-accent text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                      Placeholder
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-ink/58">{product.description}</p>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-mono text-lg text-ink">{formatNGN(product.price_ngn)}</div>
                      {product.compare_at_ngn != null ? (
                        <div className="mt-1 text-xs text-ink/45 line-through">
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

function BeautyCue({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Droplets;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-ivory/10 bg-ivory/6 p-4 backdrop-blur-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/16 bg-gold/10 text-gold-light">
        <Icon size={18} />
      </div>
      <div className="mt-4 font-accent text-[10px] uppercase tracking-[0.3em] text-gold-light">{title}</div>
      <p className="mt-2 text-sm leading-6 text-ivory/68">{body}</p>
    </div>
  );
}

function MetricTile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[30px] border border-nude/55 bg-ivory/72 p-6 shadow-[0_20px_80px_-56px_rgba(45,31,19,0.35)]">
      <div className="font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">{label}</div>
      <div className="mt-3 font-heading text-4xl text-ink">{value}</div>
      <p className="mt-2 text-sm text-ink/58">{note}</p>
    </div>
  );
}

function FeaturedProductCard({ product }: { product: ShopProductRecord }) {
  return (
    <article className="overflow-hidden rounded-[32px] border border-nude/55 bg-cream shadow-[0_24px_90px_-58px_rgba(37,27,17,0.42)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(17,12,9,0.18)_72%,rgba(17,12,9,0.36)_100%)]" />
        <div className="absolute left-5 top-5 rounded-full border border-ivory/50 bg-ivory/76 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink/72">
          {product.category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-heading text-2xl text-ink">{product.name}</h4>
            <p className="mt-3 text-sm leading-6 text-ink/62">{product.subtitle}</p>
          </div>
          <Sparkles size={18} className="shrink-0 text-gold-deep" />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="font-mono text-lg text-ink">{formatNGN(product.price_ngn)}</span>
          <span className="rounded-full bg-ivory px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink/58">
            Placeholder visual
          </span>
        </div>
      </div>
    </article>
  );
}
