import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { LuxLink } from "@/components/LuxButton";
import { useCart } from "@/components/providers/CartProvider";
import { formatNGN } from "@/lib/services";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart - Loofah Spa Abuja" },
      {
        name: "description",
        content: "Review your Loofah Spa skincare cart before checkout.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const deliveryFee = items.length > 0 ? 5000 : 0;
  const total = subtotal + deliveryFee;

  return (
    <section className="min-h-screen bg-cream pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Cart</span>
            <h1 className="mt-4 font-display italic text-display text-ink">Your shelf selection.</h1>
          </div>
          <LuxLink to="/shop" variant="ghost">
            Continue shopping
          </LuxLink>
        </div>

        {items.length === 0 ? (
          <div className="mt-14 rounded-[30px] border border-nude/50 bg-ivory p-10 text-center">
            <ShoppingBag size={28} className="mx-auto text-gold-deep" />
            <h2 className="mt-6 font-display italic text-4xl text-ink">Your cart is empty.</h2>
            <p className="mt-4 text-ink/65 max-w-xl mx-auto">
              Add clinic-approved skincare to continue to checkout.
            </p>
            <div className="mt-8">
              <LuxLink to="/shop">Browse the shop</LuxLink>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="grid gap-5 rounded-[28px] border border-nude/50 bg-ivory p-5 md:grid-cols-[150px_1fr]"
                >
                  <div className="aspect-[1/1] overflow-hidden rounded-2xl">
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-2xl text-ink">{item.name}</h2>
                        <div className="mt-2 font-mono text-sm text-ink/65">{formatNGN(item.price_ngn)}</div>
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-destructive"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-nude/50 bg-cream p-1">
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          className="rounded-full p-2 text-ink/70 hover:bg-ivory"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-10 text-center text-sm text-ink">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          disabled={item.quantity >= item.inventory_count}
                          className="rounded-full p-2 text-ink/70 hover:bg-ivory"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-base text-ink">
                          {formatNGN(item.price_ngn * item.quantity)}
                        </div>
                        <div className="mt-1 text-xs text-ink/45">
                          {item.inventory_count} available
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[30px] border border-nude/50 bg-ivory p-7 h-fit sticky top-28">
              <div className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">Summary</div>
              <div className="mt-6 space-y-4 text-sm text-ink/70">
                <LineItem label="Subtotal" value={formatNGN(subtotal)} />
                <LineItem label="Delivery" value={formatNGN(deliveryFee)} />
                <LineItem label="Total" value={formatNGN(total)} strong />
              </div>
              <div className="mt-8">
                <LuxLink to="/checkout" className="w-full">
                  Proceed to checkout
                </LuxLink>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function LineItem({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "text-ink" : ""}>{label}</span>
      <span className={strong ? "font-mono text-base text-ink" : "font-mono text-ink"}>{value}</span>
    </div>
  );
}
