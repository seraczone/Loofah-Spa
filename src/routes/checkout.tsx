import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, MessageCircle, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { LuxButton, LuxLink } from "@/components/LuxButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { createOrder, fetchShopProducts, saveLead } from "@/lib/app-store";
import { formatNGN } from "@/lib/services";
import { wa } from "@/lib/site";

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Use a valid email."),
  phone: z.string().trim().min(7, "Use a reachable phone number."),
  delivery_address: z.string().trim().min(10, "Enter the delivery address."),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().trim().min(2, "Enter the state."),
  notes: z.string().trim().max(500).optional(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout - Loofah Spa Abuja" },
      {
        name: "description",
        content: "Submit your skincare order and delivery details with Loofah Spa Abuja.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    delivery_address: "",
    city: "Abuja",
    state: "FCT",
    notes: "",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || profile?.full_name || user?.user_metadata?.full_name || "",
      email: current.email || user?.email || "",
      phone: current.phone || profile?.whatsapp || "",
    }));
  }, [profile?.full_name, profile?.whatsapp, user?.email, user?.user_metadata?.full_name]);

  const deliveryFee = items.length > 0 ? 5000 : 0;
  const total = subtotal + deliveryFee;
  const orderSummary = useMemo(
    () => items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
    [items],
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setPending(true);
      const products = await fetchShopProducts();
      const unavailable = items
        .map((item) => {
          const product = products.products.find((candidate) => candidate.slug === item.slug);
          if (!product || !product.in_stock) return `${item.name} is sold out`;
          if (item.quantity > product.inventory_count) {
            return `${item.name} only has ${product.inventory_count} left`;
          }
          return null;
        })
        .filter(Boolean);

      if (unavailable.length > 0) {
        toast.error(unavailable[0] ?? "Some cart items are no longer available.");
        return;
      }

      const checkout = await createOrder({
        user_id: user?.id ?? null,
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone,
        delivery_address: form.delivery_address,
        city: form.city,
        state: form.state,
        notes: form.notes || null,
        subtotal_ngn: subtotal,
        delivery_fee_ngn: deliveryFee,
        total_ngn: total,
        metadata: {
          item_count: items.length,
          source: "shop-checkout",
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          product_slug: item.slug,
          product_name: item.name,
          unit_price_ngn: item.price_ngn,
          quantity: item.quantity,
          line_total_ngn: item.price_ngn * item.quantity,
        })),
      }, { requireSupabase: true });

      try {
        await saveLead(
          {
            user_id: user?.id ?? null,
            lead_type: "checkout",
            source: "shop-checkout",
            name: form.customer_name,
            email: form.email,
            whatsapp: form.phone,
            message: `Order ${checkout.order.order_number} requested for ${orderSummary}`,
            metadata: {
              order_number: checkout.order.order_number,
              total_ngn: total,
            },
          },
          { requireSupabase: true },
        );
      } catch (error) {
        console.warn("[checkout] lead mirror failed", error);
      }

      clearCart();
      setResult({
        orderNumber: checkout.order.order_number,
        total: checkout.order.total_ngn,
      });
      toast.success("Order submitted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  if (result) {
    return (
      <section className="min-h-screen bg-ivory pt-32 pb-24 px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl mx-auto w-full rounded-[34px] border border-nude/50 bg-cream p-10 lg:p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink">
            <Check size={28} />
          </div>
          <h1 className="mt-8 font-display italic text-display text-ink">Order received.</h1>
          <p className="mt-4 text-ink/68 max-w-xl mx-auto">
            Reference <strong>{result.orderNumber}</strong>. We will confirm stock and delivery timing shortly.
          </p>
          <div className="mt-10 rounded-3xl border border-nude/50 bg-ivory p-7 text-left">
            <SummaryRow label="Order" value={result.orderNumber} />
            <SummaryRow label="Total" value={formatNGN(result.total)} />
            <SummaryRow label="Status" value="Saved to live operations" />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LuxLink
              to={wa(
                `Hi Loofah Spa! I just placed order ${result.orderNumber} and would like to confirm delivery details.`,
              )}
              external
            >
              <MessageCircle size={14} />
              Confirm on WhatsApp
            </LuxLink>
            <LuxLink to="/shop" variant="ghost">
              Continue shopping
            </LuxLink>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-screen bg-cream pt-32 pb-24 px-6 lg:px-12 flex items-center">
        <div className="max-w-3xl mx-auto w-full rounded-[34px] border border-nude/50 bg-ivory p-10 text-center">
          <ReceiptText size={30} className="mx-auto text-gold-deep" />
          <h1 className="mt-6 font-display italic text-display text-ink">Nothing to check out yet.</h1>
          <p className="mt-4 text-ink/68 max-w-xl mx-auto">
            Add skincare essentials to your cart before submitting delivery details.
          </p>
          <div className="mt-8">
            <LuxLink to="/shop">Open the shop</LuxLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-ivory pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={submit} className="rounded-[34px] border border-nude/50 bg-cream p-8 lg:p-10">
          <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Checkout</span>
          <h1 className="mt-4 font-display italic text-display text-ink">Delivery details.</h1>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Field
              label="Full name"
              value={form.customer_name}
              onChange={(value) => setForm((current) => ({ ...current, customer_name: value }))}
              error={errors.customer_name}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
              error={errors.email}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
              error={errors.phone}
            />
            <Field
              label="City"
              value={form.city}
              onChange={(value) => setForm((current) => ({ ...current, city: value }))}
              error={errors.city}
            />
            <Field
              label="State"
              value={form.state}
              onChange={(value) => setForm((current) => ({ ...current, state: value }))}
              error={errors.state}
            />
            <label className="md:col-span-2 block">
              <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">
                Delivery address
              </span>
              <textarea
                value={form.delivery_address}
                onChange={(event) =>
                  setForm((current) => ({ ...current, delivery_address: event.target.value }))
                }
                rows={4}
                className="mt-2 w-full rounded-2xl border border-nude/60 bg-ivory p-4 outline-none transition-colors focus:border-gold"
              />
              {errors.delivery_address ? (
                <span className="mt-1 block text-xs text-destructive">{errors.delivery_address}</span>
              ) : null}
            </label>
            <label className="md:col-span-2 block">
              <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">
                Notes
              </span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-nude/60 bg-ivory p-4 outline-none transition-colors focus:border-gold"
                placeholder="Gate code, delivery timing, treatment pairing notes..."
              />
            </label>
          </div>
          <div className="mt-8">
            <LuxButton type="submit" className="w-full !justify-center" disabled={pending}>
              {pending ? "Submitting..." : "Submit Order"}
            </LuxButton>
          </div>
        </form>

        <aside className="rounded-[34px] border border-nude/50 bg-dark-surface p-8 lg:p-10 text-ivory h-fit sticky top-28">
          <div className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold">Order summary</div>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-4 border-b border-gold/10 pb-4">
                <div>
                  <div className="font-heading text-lg">{item.name}</div>
                  <div className="mt-1 text-xs text-ivory/55">
                    {item.quantity} x {formatNGN(item.price_ngn)}
                  </div>
                </div>
                <div className="font-mono text-sm text-gold-light">
                  {formatNGN(item.price_ngn * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3 text-sm text-ivory/70">
            <SummaryRow label="Subtotal" value={formatNGN(subtotal)} />
            <SummaryRow label="Delivery" value={formatNGN(deliveryFee)} />
            <SummaryRow label="Total" value={formatNGN(total)} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-deep">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-nude/60 bg-ivory px-5 py-4 outline-none transition-colors focus:border-gold"
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}
