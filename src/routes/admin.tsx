import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LockKeyhole, Shield, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LuxLink } from "@/components/LuxButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { Calendar } from "@/components/ui/calendar";
import type {
  BookingRecord,
  BookingStatus,
  DashboardSnapshot,
  LeadRecord,
  LeadStatus,
  OrderRecord,
  OrderStatus,
  ShopProductRecord,
} from "@/lib/app-data";
import {
  fetchDashboardSnapshot,
  updateBookingStatus,
  updateLeadStatus,
  updateOrderStatus,
  updateProductInventory,
} from "@/lib/app-store";
import { formatNGN } from "@/lib/services";

type AdminView = "overview" | "calendar" | "crm" | "store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - Loofah Spa Abuja" },
      {
        name: "description",
        content:
          "Protected back office for Loofah Spa bookings, leads, orders and storefront performance.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const auth = useAuth();
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AdminView>("crm");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [inventoryDrafts, setInventoryDrafts] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const canPreview = import.meta.env.DEV && Boolean(auth.user);
  const canAccess = auth.isAdmin || canPreview;

  async function refreshSnapshot() {
    setLoading(true);
    try {
      const result = await fetchDashboardSnapshot();
      setMode(result.mode);
      setSnapshot(result.snapshot);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load admin data.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canAccess) {
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    fetchDashboardSnapshot()
      .then((result) => {
        if (!alive) return;
        setMode(result.mode);
        setSnapshot(result.snapshot);
      })
      .catch((error) => {
        if (!alive) return;
        const message = error instanceof Error ? error.message : "Unable to load admin data.";
        toast.error(message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [canAccess]);

  useEffect(() => {
    if (!snapshot) return;
    setInventoryDrafts(
      Object.fromEntries(
        snapshot.products.map((product) => [product.id, String(product.inventory_count)]),
      ),
    );
  }, [snapshot]);

  const chartData = useMemo(
    () =>
      snapshot
        ? [
            { name: "Bookings", value: snapshot.metrics.bookings },
            { name: "CRM", value: snapshot.metrics.intakeContacts },
            { name: "Orders", value: snapshot.metrics.orders },
          ]
        : [],
    [snapshot],
  );

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const dayBookings = useMemo(
    () =>
      (snapshot?.bookings ?? []).filter((booking) => booking.booking_date === selectedDateKey),
    [selectedDateKey, snapshot?.bookings],
  );
  const upcomingBookings = useMemo(
    () =>
      (snapshot?.bookings ?? [])
        .filter((booking) => ["pending", "confirmed"].includes(booking.status))
        .slice(0, 6),
    [snapshot?.bookings],
  );
  const crmContacts = useMemo(
    () => (snapshot?.leads ?? []).filter((lead) => lead.lead_type === "visitor_intake"),
    [snapshot?.leads],
  );
  const pipelineLeads = useMemo(
    () => (snapshot?.leads ?? []).filter((lead) => lead.lead_type !== "visitor_intake"),
    [snapshot?.leads],
  );
  const pendingOrders = useMemo(
    () => (snapshot?.orders ?? []).filter((order) => order.status === "pending").length,
    [snapshot?.orders],
  );
  const newCrmContacts = useMemo(
    () => crmContacts.filter((lead) => lead.status === "new").length,
    [crmContacts],
  );

  async function handleBookingStatus(id: string, status: BookingStatus) {
    try {
      setBusyKey(`booking-${id}`);
      const updated = await updateBookingStatus(id, status);
      setSnapshot((current) =>
        current
          ? {
              ...current,
              bookings: current.bookings.map((booking) => (booking.id === id ? updated : booking)),
            }
          : current,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update booking.";
      toast.error(message);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleLeadStatus(id: string, status: LeadStatus) {
    try {
      setBusyKey(`lead-${id}`);
      const updated = await updateLeadStatus(id, status);
      setSnapshot((current) =>
        current
          ? {
              ...current,
              leads: current.leads.map((lead) => (lead.id === id ? updated : lead)),
            }
          : current,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update lead.";
      toast.error(message);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleOrderStatus(id: string, status: OrderStatus) {
    try {
      setBusyKey(`order-${id}`);
      const updated = await updateOrderStatus(id, status);
      setSnapshot((current) =>
        current
          ? {
              ...current,
              orders: current.orders.map((order) => (order.id === id ? updated : order)),
            }
          : current,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update order.";
      toast.error(message);
    } finally {
      setBusyKey(null);
    }
  }

  async function handleInventoryUpdate(product: ShopProductRecord) {
    const raw = inventoryDrafts[product.id];
    const nextCount = Number(raw);

    if (Number.isNaN(nextCount) || nextCount < 0) {
      toast.error("Inventory must be a valid number.");
      return;
    }

    try {
      setBusyKey(`product-${product.id}`);
      const updated = await updateProductInventory(product.id, nextCount);
      setSnapshot((current) =>
        current
          ? {
              ...current,
              products: current.products.map((item) => (item.id === updated.id ? updated : item)),
            }
          : current,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update inventory.";
      toast.error(message);
    } finally {
      setBusyKey(null);
    }
  }

  if (!auth.ready) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-cream px-6 pb-24 pt-32 lg:px-12">
        <div className="rounded-3xl bg-ivory px-8 py-10 text-center text-ink/70">
          Loading admin access...
        </div>
      </section>
    );
  }

  if (!auth.user) {
    return (
      <section className="flex min-h-screen items-center bg-dark-surface px-6 pb-24 pt-32 text-ivory lg:px-12">
        <div className="mx-auto w-full max-w-3xl rounded-[34px] border border-gold/15 bg-dark-card p-10 text-center lg:p-14">
          <LockKeyhole size={30} className="mx-auto text-gold" />
          <h1 className="mt-6 font-display text-display italic">Admin access is protected.</h1>
          <p className="mx-auto mt-4 max-w-xl text-ivory/68">
            Sign in with an account that exists in the <code>user_roles</code> table with the <code>admin</code> role.
          </p>
          <div className="mt-8">
            <LuxLink to="/auth" variant="secondary">
              Sign in
            </LuxLink>
          </div>
        </div>
      </section>
    );
  }

  if (!canAccess) {
    return (
      <section className="flex min-h-screen items-center bg-cream px-6 pb-24 pt-32 lg:px-12">
        <div className="mx-auto w-full max-w-3xl rounded-[34px] border border-nude/50 bg-ivory p-10 text-center lg:p-14">
          <Shield size={30} className="mx-auto text-gold-deep" />
          <h1 className="mt-6 font-display text-display italic text-ink">You are signed in, but not an admin.</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Assign <code>admin</code> in <code>public.user_roles</code> for this account to unlock the dashboard.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-ivory px-6 pb-24 pt-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold-deep">MVP admin</span>
            <h1 className="mt-4 font-display text-display italic text-ink">CRM first. Bookings and store next.</h1>
            <p className="mt-4 max-w-2xl text-ink/68">
              First-visit intake, live appointments, orders, and inventory now feed one compact back office for day-to-day staff work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!auth.isAdmin && canPreview ? (
              <span className="rounded-full border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold-deep">
                Dev preview
              </span>
            ) : null}
            <span className="rounded-full border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold-deep">
              {mode === "supabase" ? "Live data" : "Offline preview"}
            </span>
            <button
              onClick={() => void refreshSnapshot()}
              className="rounded-full border border-ink/15 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-ink transition-colors hover:border-gold"
            >
              Refresh
            </button>
            <LuxLink to="/shop" variant="ghost">
              Open shop
            </LuxLink>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <ViewTab label="Overview" active={view === "overview"} onClick={() => setView("overview")} />
          <ViewTab label="Calendar" active={view === "calendar"} onClick={() => setView("calendar")} />
          <ViewTab label="CRM" active={view === "crm"} onClick={() => setView("crm")} />
          <ViewTab label="Store" active={view === "store"} onClick={() => setView("store")} />
        </div>

        {!loading && snapshot ? (
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MiniCard label="New CRM leads" value={String(newCrmContacts)} />
            <MiniCard label="Upcoming bookings" value={String(snapshot.metrics.upcomingBookings)} />
            <MiniCard label="Pending orders" value={String(pendingOrders)} />
            <MiniCard label="Revenue" value={formatNGN(snapshot.metrics.revenue)} />
          </div>
        ) : null}

        {loading || !snapshot ? (
          <div className="mt-12 rounded-[30px] border border-nude/50 bg-cream px-8 py-10 text-center text-ink/70">
            Loading operational data...
          </div>
        ) : null}

        {!loading && snapshot && view === "overview" ? (
          <>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Bookings" value={String(snapshot.metrics.bookings)} />
              <MetricCard label="Upcoming" value={String(snapshot.metrics.upcomingBookings)} />
              <MetricCard label="CRM contacts" value={String(snapshot.metrics.intakeContacts)} />
              <MetricCard label="Orders" value={String(snapshot.metrics.orders)} />
              <MetricCard label="Revenue" value={formatNGN(snapshot.metrics.revenue)} />
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-8">
                <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">
                  Operations mix
                </div>
                <div className="mt-6 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} stroke="#d8c8b0" strokeDasharray="2 6" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: "rgba(201,169,110,0.12)" }} />
                      <Bar dataKey="value" fill="#c9a96e" radius={[14, 14, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-[30px] border border-nude/50 bg-dark-surface p-6 text-ivory lg:p-8">
                <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold">What changed</div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <OpsCard icon={Sparkles} title="CRM" body="New visitors now pass through an intake gate before exploring the site." />
                  <OpsCard icon={Shield} title="Calendar" body="Appointments land on a live internal calendar instead of a passive request queue." />
                  <OpsCard icon={ShoppingBag} title="Store" body="Stock visibility now feeds cart controls and the admin inventory panel." />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
                <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Upcoming bookings</div>
                <div className="mt-6 space-y-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <BookingSummaryCard
                        key={booking.id}
                        booking={booking}
                        onChange={handleBookingStatus}
                        busy={busyKey === `booking-${booking.id}`}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-nude/50 px-5 py-8 text-sm text-ink/55">
                      No upcoming bookings yet.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
                <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Newest CRM contacts</div>
                <div className="mt-6 space-y-4">
                  {crmContacts.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="rounded-2xl border border-nude/50 bg-ivory p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-heading text-lg text-ink">{lead.name}</div>
                          <div className="mt-1 text-sm text-ink/58">
                            {lead.whatsapp || lead.email || "-"}
                          </div>
                        </div>
                        <span className="rounded-full bg-gold/15 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                          {String(lead.metadata.interest ?? "Website lead")}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-ink/65">
                        {String(lead.metadata.skin_goals ?? lead.message ?? "No notes yet.")}
                      </div>
                    </div>
                  ))}
                  {crmContacts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-nude/50 px-5 py-8 text-sm text-ink/55">
                      No CRM intake contacts yet.
                    </div>
                  ) : null}
                </div>
              </article>
            </div>
          </>
        ) : null}

        {!loading && snapshot && view === "calendar" ? (
          <div className="mt-12 grid gap-8 xl:grid-cols-[0.62fr_1.38fr]">
            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Appointment calendar</div>
              <div className="mt-4 rounded-3xl border border-nude/40 bg-ivory p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date);
                  }}
                  className="mx-auto bg-transparent"
                />
              </div>
              <div className="mt-6 rounded-2xl border border-gold/15 bg-dark-surface p-5 text-ivory">
                <div className="font-accent text-[10px] uppercase tracking-[0.26em] text-gold-light">
                  Selected date
                </div>
                <div className="mt-3 font-display text-3xl italic">
                  {format(selectedDate, "EEE, d MMM")}
                </div>
                <div className="mt-2 text-sm text-ivory/65">
                  {dayBookings.length} appointment{dayBookings.length === 1 ? "" : "s"} on the live calendar
                </div>
              </div>
            </article>

            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Daily schedule</div>
                  <h2 className="mt-2 font-display text-3xl italic text-ink">
                    {format(selectedDate, "EEEE, d MMMM yyyy")}
                  </h2>
                </div>
                <div className="rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold-deep">
                  Internal brand calendar
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {dayBookings.length > 0 ? (
                  dayBookings.map((booking) => (
                    <BookingSummaryCard
                      key={booking.id}
                      booking={booking}
                      onChange={handleBookingStatus}
                      busy={busyKey === `booking-${booking.id}`}
                      expanded
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-nude/50 px-5 py-10 text-center text-sm text-ink/55">
                    No appointments scheduled for this date yet.
                  </div>
                )}
              </div>
            </article>
          </div>
        ) : null}

        {!loading && snapshot && view === "crm" ? (
          <div className="mt-12 space-y-8">
            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Visitor intake CRM</div>
                  <h2 className="mt-2 font-display text-3xl italic text-ink">Contacts captured before entry.</h2>
                  <p className="mt-3 max-w-2xl text-sm text-ink/60">
                    Every first-visit modal submission is written straight into Supabase CRM before the site unlocks.
                  </p>
                </div>
                <div className="rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold-deep">
                  {crmContacts.length} contacts
                </div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-nude/50 text-[10px] uppercase tracking-[0.22em] text-ink/45">
                      <th className="pb-3 pr-4 font-medium">Guest</th>
                      <th className="pb-3 pr-4 font-medium">Contact</th>
                      <th className="pb-3 pr-4 font-medium">Interest</th>
                      <th className="pb-3 pr-4 font-medium">Location</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmContacts.length > 0 ? (
                      crmContacts.map((lead) => (
                        <tr key={lead.id} className="border-b border-nude/35 text-sm text-ink/72">
                          <td className="py-4 pr-4 align-top">
                            <div className="font-medium text-ink">{lead.name}</div>
                            <div className="mt-1 text-xs text-ink/48">{formatTimestamp(lead.created_at)}</div>
                            <div className="mt-2 text-xs text-ink/58">{String(lead.metadata.skin_goals ?? "No notes shared.")}</div>
                          </td>
                          <td className="py-4 pr-4 align-top">
                            <div>{lead.whatsapp || "-"}</div>
                            <div className="mt-1">{lead.email || "-"}</div>
                            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-gold-deep">
                              {String(lead.metadata.preferred_contact ?? "whatsapp")}
                            </div>
                          </td>
                          <td className="py-4 pr-4 align-top">{String(lead.metadata.interest ?? "-")}</td>
                          <td className="py-4 pr-4 align-top">
                            {String(lead.metadata.city ?? "-")}
                            {lead.metadata.state ? `, ${String(lead.metadata.state)}` : ""}
                          </td>
                          <td className="py-4 pr-4 align-top">
                            <StatusField
                              value={lead.status}
                              options={["new", "contacted", "qualified", "closed"]}
                              disabled={busyKey === `lead-${lead.id}`}
                              onChange={(value) => void handleLeadStatus(lead.id, value as LeadStatus)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-sm text-ink/45">
                          No intake contacts yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Lead pipeline</div>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-nude/50 text-[10px] uppercase tracking-[0.22em] text-ink/45">
                      <th className="pb-3 pr-4 font-medium">Lead</th>
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">Message</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipelineLeads.length > 0 ? (
                      pipelineLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-nude/35 text-sm text-ink/72">
                          <td className="py-4 pr-4 align-top">
                            <div className="font-medium text-ink">{lead.name}</div>
                            <div className="mt-1 text-xs text-ink/48">{lead.whatsapp || lead.email || "-"}</div>
                          </td>
                          <td className="py-4 pr-4 align-top uppercase tracking-[0.16em] text-gold-deep">{lead.lead_type.replace("_", " ")}</td>
                          <td className="py-4 pr-4 align-top">{lead.message || "-"}</td>
                          <td className="py-4 pr-4 align-top">
                            <StatusField
                              value={lead.status}
                              options={["new", "contacted", "qualified", "closed"]}
                              disabled={busyKey === `lead-${lead.id}`}
                              onChange={(value) => void handleLeadStatus(lead.id, value as LeadStatus)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-sm text-ink/45">
                          No non-intake leads yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        ) : null}

        {!loading && snapshot && view === "store" ? (
          <div className="mt-12 space-y-8">
            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Order queue</div>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-nude/50 text-[10px] uppercase tracking-[0.22em] text-ink/45">
                      <th className="pb-3 pr-4 font-medium">Order</th>
                      <th className="pb-3 pr-4 font-medium">Client</th>
                      <th className="pb-3 pr-4 font-medium">Delivery</th>
                      <th className="pb-3 pr-4 font-medium">Total</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.orders.length > 0 ? (
                      snapshot.orders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          busy={busyKey === `order-${order.id}`}
                          onChange={handleOrderStatus}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-sm text-ink/45">
                          No orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-[30px] border border-nude/50 bg-cream p-6 lg:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">Inventory</div>
                  <h2 className="mt-2 font-display text-3xl italic text-ink">Current shelf stock.</h2>
                </div>
                <div className="rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold-deep">
                  {snapshot.products.length} products
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-nude/50 text-[10px] uppercase tracking-[0.22em] text-ink/45">
                      <th className="pb-3 pr-4 font-medium">Product</th>
                      <th className="pb-3 pr-4 font-medium">Price</th>
                      <th className="pb-3 pr-4 font-medium">Stock</th>
                      <th className="pb-3 pr-4 font-medium">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.products.map((product) => (
                      <tr key={product.id} className="border-b border-nude/35 text-sm text-ink/72">
                        <td className="py-4 pr-4 align-top">
                          <div className="font-medium text-ink">{product.name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-gold-deep">{product.category}</div>
                        </td>
                        <td className="py-4 pr-4 align-top">{formatNGN(product.price_ngn)}</td>
                        <td className="py-4 pr-4 align-top">
                          <input
                            type="number"
                            min={0}
                            value={inventoryDrafts[product.id] ?? String(product.inventory_count)}
                            onChange={(event) =>
                              setInventoryDrafts((current) => ({
                                ...current,
                                [product.id]: event.target.value,
                              }))
                            }
                            className="w-28 rounded-xl border border-nude/60 bg-ivory px-4 py-3 outline-none focus:border-gold"
                          />
                          <div className="mt-2 text-xs text-ink/48">
                            {product.in_stock ? "Available online" : "Sold out"}
                          </div>
                        </td>
                        <td className="py-4 pr-4 align-top">
                          <button
                            onClick={() => void handleInventoryUpdate(product)}
                            disabled={busyKey === `product-${product.id}`}
                            className="rounded-pill bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {busyKey === `product-${product.id}` ? "Saving..." : "Save stock"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ViewTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${
        active ? "border-ink bg-ink text-ivory" : "border-nude/60 bg-cream text-ink/65 hover:border-gold"
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[28px] border border-nude/50 bg-cream p-6">
      <div className="font-accent text-[10px] uppercase tracking-[0.28em] text-gold-deep">{label}</div>
      <div className="mt-4 font-display text-5xl italic text-ink">{value}</div>
    </article>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-nude/45 bg-cream px-5 py-4">
      <div className="font-accent text-[10px] uppercase tracking-[0.24em] text-gold-deep">{label}</div>
      <div className="mt-2 font-heading text-2xl text-ink">{value}</div>
    </article>
  );
}

function OpsCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-gold/15 bg-ink/35 p-5">
      <Icon size={20} className="text-gold" />
      <div className="mt-4 font-heading text-xl">{title}</div>
      <p className="mt-3 text-sm text-ivory/65">{body}</p>
    </div>
  );
}

function BookingSummaryCard({
  booking,
  onChange,
  busy,
  expanded = false,
}: {
  booking: BookingRecord;
  onChange: (id: string, status: BookingStatus) => Promise<void>;
  busy: boolean;
  expanded?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-nude/50 bg-ivory p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="font-heading text-xl text-ink">{booking.service_name}</div>
          <div className="mt-2 text-sm text-ink/60">
            {booking.name} / {booking.whatsapp}
          </div>
          <div className="mt-2 text-sm text-ink/60">
            {booking.booking_date} at {booking.booking_time} / {booking.duration_minutes} minutes
          </div>
          {expanded ? (
            <div className="mt-2 text-sm text-ink/55">
              {booking.notes || booking.preferred_therapist || "No extra notes."}
            </div>
          ) : null}
        </div>
        <div className="w-full max-w-[220px]">
          <StatusField
            value={booking.status}
            options={["pending", "confirmed", "completed", "cancelled"]}
            disabled={busy}
            onChange={(value) => void onChange(booking.id, value as BookingStatus)}
          />
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  busy,
  onChange,
}: {
  order: OrderRecord;
  busy: boolean;
  onChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  return (
    <tr className="border-b border-nude/35 text-sm text-ink/72">
      <td className="py-4 pr-4 align-top">
        <div className="font-medium text-ink">{order.order_number}</div>
        <div className="mt-1 text-xs text-ink/48">{formatTimestamp(order.created_at)}</div>
      </td>
      <td className="py-4 pr-4 align-top">
        <div>{order.customer_name}</div>
        <div className="mt-1 text-xs text-ink/48">{order.phone}</div>
      </td>
      <td className="py-4 pr-4 align-top">
        <div>{order.city}, {order.state}</div>
        <div className="mt-1 text-xs text-ink/48">{order.delivery_address}</div>
      </td>
      <td className="py-4 pr-4 align-top">{formatNGN(order.total_ngn)}</td>
      <td className="py-4 pr-4 align-top">
        <StatusField
          value={order.status}
          options={["pending", "processing", "fulfilled", "cancelled"]}
          disabled={busy}
          onChange={(value) => void onChange(order.id, value as OrderStatus)}
        />
      </td>
    </tr>
  );
}

function StatusField({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-nude/60 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-gold disabled:cursor-not-allowed disabled:opacity-45"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function formatTimestamp(value: string) {
  try {
    return format(new Date(value), "d MMM yyyy, h:mm a");
  } catch {
    return value;
  }
}
