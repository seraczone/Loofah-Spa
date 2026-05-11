import type {
  BookingInput,
  BookingRecord,
  BookingStatus,
  CheckoutInput,
  DashboardSnapshot,
  LeadInput,
  LeadRecord,
  LeadStatus,
  OrderItemRecord,
  OrderRecord,
  OrderStatus,
  ProfileRecord,
  ShopProductRecord,
  UserRoleRecord,
} from "@/lib/app-data";
import { SHOP_PRODUCTS } from "@/lib/shop";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type StorageMode = "supabase" | "local";
type PersistOptions = { requireSupabase?: boolean };

const STORAGE_KEYS = {
  bookings: "loofah-bookings",
  leads: "loofah-leads",
  orders: "loofah-orders",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocal<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function appendLocal<T>(key: string, value: T): T {
  const next = [value, ...readLocal<T>(key)];
  writeLocal(key, next);
  return value;
}

function updateLocalCollection<T extends { id: string }>(
  key: string,
  targetId: string,
  update: (value: T) => T,
) {
  const current = readLocal<T>(key);
  const next = current.map((item) => (item.id === targetId ? update(item) : item));
  writeLocal(key, next);
  return next.find((item) => item.id === targetId) ?? null;
}

function randomId(prefix: string) {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return `${prefix}-${cryptoApi.randomUUID()}`;
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function randomUuid() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const value = Math.floor(Math.random() * 16);
    const next = char === "x" ? value : (value & 0x3) | 0x8;
    return next.toString(16);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function newOrderNumber() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("");
  return `LSA-${stamp}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function toRecordPatch<T extends object>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as Record<string, unknown>;
}

function normalizeProduct(raw: Partial<ShopProductRecord> & { id: string; slug: string; name: string; category: string; description: string; image_url: string }) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    subtitle: raw.subtitle ?? null,
    description: raw.description,
    image_url: raw.image_url,
    price_ngn: Number(raw.price_ngn ?? 0),
    compare_at_ngn: raw.compare_at_ngn == null ? null : Number(raw.compare_at_ngn),
    featured: Boolean(raw.featured),
    in_stock: Boolean(raw.in_stock),
    inventory_count: Number(raw.inventory_count ?? 0),
    instagram_url: raw.instagram_url ?? null,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  } satisfies ShopProductRecord;
}

function toProfileRecord(raw: Partial<ProfileRecord> & { id: string }): ProfileRecord {
  return {
    id: raw.id,
    full_name: raw.full_name ?? null,
    email: raw.email ?? null,
    whatsapp: raw.whatsapp ?? null,
    avatar_url: raw.avatar_url ?? null,
    city: raw.city ?? null,
    state: raw.state ?? null,
    preferred_contact: raw.preferred_contact ?? null,
    skin_goals: raw.skin_goals ?? null,
    visit_intake_completed_at: raw.visit_intake_completed_at ?? null,
    created_at: raw.created_at ?? nowIso(),
    updated_at: raw.updated_at ?? nowIso(),
  };
}

function normalizeBooking(raw: Partial<BookingRecord> & { id: string }): BookingRecord {
  return {
    id: raw.id,
    user_id: raw.user_id ?? null,
    category: raw.category ?? null,
    service_slug: raw.service_slug ?? "",
    service_name: raw.service_name ?? "",
    booking_date: raw.booking_date ?? "",
    booking_time: raw.booking_time ?? "",
    status: raw.status ?? "pending",
    duration_minutes: Number(raw.duration_minutes ?? 60),
    appointment_start_at: raw.appointment_start_at ?? null,
    appointment_end_at: raw.appointment_end_at ?? null,
    name: raw.name ?? "",
    email: raw.email ?? null,
    whatsapp: raw.whatsapp ?? "",
    notes: raw.notes ?? null,
    preferred_therapist: raw.preferred_therapist ?? null,
    source: raw.source ?? "website",
    metadata: (raw.metadata as Record<string, unknown> | undefined) ?? {},
    created_at: raw.created_at ?? nowIso(),
    updated_at: raw.updated_at ?? nowIso(),
  };
}

function normalizeLead(raw: Partial<LeadRecord> & { id: string }): LeadRecord {
  return {
    id: raw.id,
    user_id: raw.user_id ?? null,
    lead_type: raw.lead_type ?? "contact",
    source: raw.source ?? "website",
    name: raw.name ?? "",
    email: raw.email ?? null,
    whatsapp: raw.whatsapp ?? null,
    message: raw.message ?? null,
    status: raw.status ?? "new",
    metadata: (raw.metadata as Record<string, unknown> | undefined) ?? {},
    created_at: raw.created_at ?? nowIso(),
  };
}

function normalizeOrder(raw: Partial<OrderRecord> & { id: string }): OrderRecord {
  return {
    id: raw.id,
    order_number: raw.order_number ?? newOrderNumber(),
    user_id: raw.user_id ?? null,
    customer_name: raw.customer_name ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    delivery_address: raw.delivery_address ?? "",
    city: raw.city ?? "",
    state: raw.state ?? "",
    notes: raw.notes ?? null,
    subtotal_ngn: Number(raw.subtotal_ngn ?? 0),
    delivery_fee_ngn: Number(raw.delivery_fee_ngn ?? 0),
    total_ngn: Number(raw.total_ngn ?? 0),
    status: raw.status ?? "pending",
    payment_status: raw.payment_status ?? "unpaid",
    payment_reference: raw.payment_reference ?? null,
    metadata: (raw.metadata as Record<string, unknown> | undefined) ?? {},
    created_at: raw.created_at ?? nowIso(),
    updated_at: raw.updated_at ?? nowIso(),
  };
}

function normalizeOrderItem(raw: Partial<OrderItemRecord> & { id: string }): OrderItemRecord {
  return {
    id: raw.id,
    order_id: raw.order_id ?? "",
    product_id: raw.product_id ?? null,
    product_slug: raw.product_slug ?? "",
    product_name: raw.product_name ?? "",
    unit_price_ngn: Number(raw.unit_price_ngn ?? 0),
    quantity: Number(raw.quantity ?? 0),
    line_total_ngn: Number(raw.line_total_ngn ?? 0),
    created_at: raw.created_at ?? nowIso(),
  };
}

function localBookingFromInput(input: BookingInput): BookingRecord {
  const timestamp = nowIso();
  return {
    id: randomId("booking"),
    user_id: input.user_id ?? null,
    category: input.category ?? null,
    service_slug: input.service_slug,
    service_name: input.service_name,
    booking_date: input.booking_date,
    booking_time: input.booking_time,
    status: "pending",
    duration_minutes: input.duration_minutes ?? 60,
    appointment_start_at: input.appointment_start_at ?? null,
    appointment_end_at: input.appointment_end_at ?? null,
    name: input.name,
    email: input.email ?? null,
    whatsapp: input.whatsapp,
    notes: input.notes ?? null,
    preferred_therapist: input.preferred_therapist ?? null,
    source: input.source ?? "website",
    metadata: input.metadata ?? {},
    created_at: timestamp,
    updated_at: timestamp,
  };
}

function localLeadFromInput(input: LeadInput): LeadRecord {
  return {
    id: randomId("lead"),
    user_id: input.user_id ?? null,
    lead_type: input.lead_type,
    source: input.source,
    name: input.name,
    email: input.email ?? null,
    whatsapp: input.whatsapp ?? null,
    message: input.message ?? null,
    status: "new",
    metadata: input.metadata ?? {},
    created_at: nowIso(),
  };
}

function localOrderFromInput(input: CheckoutInput): { order: OrderRecord; items: OrderItemRecord[] } {
  const orderId = randomId("order");
  const createdAt = nowIso();
  return {
    order: {
      id: orderId,
      order_number: newOrderNumber(),
      user_id: input.user_id ?? null,
      customer_name: input.customer_name,
      email: input.email,
      phone: input.phone,
      delivery_address: input.delivery_address,
      city: input.city,
      state: input.state,
      notes: input.notes ?? null,
      subtotal_ngn: input.subtotal_ngn,
      delivery_fee_ngn: input.delivery_fee_ngn,
      total_ngn: input.total_ngn,
      status: "pending",
      payment_status: "unpaid",
      payment_reference: null,
      metadata: input.metadata ?? {},
      created_at: createdAt,
      updated_at: createdAt,
    },
    items: input.items.map((item) => ({
      id: randomId("order-item"),
      order_id: orderId,
      product_id: item.product_id ?? null,
      product_slug: item.product_slug,
      product_name: item.product_name,
      unit_price_ngn: item.unit_price_ngn,
      quantity: item.quantity,
      line_total_ngn: item.line_total_ngn,
      created_at: createdAt,
    })),
  };
}

function supabaseBookingFromInput(input: BookingInput): BookingRecord {
  const timestamp = nowIso();
  return {
    id: randomUuid(),
    user_id: input.user_id ?? null,
    category: input.category ?? null,
    service_slug: input.service_slug,
    service_name: input.service_name,
    booking_date: input.booking_date,
    booking_time: input.booking_time,
    status: "pending",
    duration_minutes: input.duration_minutes ?? 60,
    appointment_start_at: input.appointment_start_at ?? null,
    appointment_end_at: input.appointment_end_at ?? null,
    name: input.name,
    email: input.email ?? null,
    whatsapp: input.whatsapp,
    notes: input.notes ?? null,
    preferred_therapist: input.preferred_therapist ?? null,
    source: input.source ?? "website",
    metadata: input.metadata ?? {},
    created_at: timestamp,
    updated_at: timestamp,
  };
}

function supabaseLeadFromInput(input: LeadInput): LeadRecord {
  return {
    id: randomUuid(),
    user_id: input.user_id ?? null,
    lead_type: input.lead_type,
    source: input.source,
    name: input.name,
    email: input.email ?? null,
    whatsapp: input.whatsapp ?? null,
    message: input.message ?? null,
    status: "new",
    metadata: input.metadata ?? {},
    created_at: nowIso(),
  };
}

function supabaseOrderFromInput(input: CheckoutInput): { order: OrderRecord; items: OrderItemRecord[] } {
  const orderId = randomUuid();
  const createdAt = nowIso();
  const orderNumber = newOrderNumber();

  return {
    order: {
      id: orderId,
      order_number: orderNumber,
      user_id: input.user_id ?? null,
      customer_name: input.customer_name,
      email: input.email,
      phone: input.phone,
      delivery_address: input.delivery_address,
      city: input.city,
      state: input.state,
      notes: input.notes ?? null,
      subtotal_ngn: input.subtotal_ngn,
      delivery_fee_ngn: input.delivery_fee_ngn,
      total_ngn: input.total_ngn,
      status: "pending",
      payment_status: "unpaid",
      payment_reference: null,
      metadata: input.metadata ?? {},
      created_at: createdAt,
      updated_at: createdAt,
    },
    items: input.items.map((item) => ({
      id: randomUuid(),
      order_id: orderId,
      product_id: item.product_id ?? null,
      product_slug: item.product_slug,
      product_name: item.product_name,
      unit_price_ngn: item.unit_price_ngn,
      quantity: item.quantity,
      line_total_ngn: item.line_total_ngn,
      created_at: createdAt,
    })),
  };
}

function toAppError(scope: string, error: unknown) {
  if (typeof error === "object" && error !== null) {
    const code = "code" in error ? String(error.code) : "";
    const message = "message" in error ? String(error.message) : "";

    if (scope === "booking" && code === "23505" && message.includes("bookings_active_slot_key")) {
      return new Error("That appointment slot has just been taken. Choose another time.");
    }

    if (message) {
      return new Error(message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(`Unable to save ${scope}.`);
}

function ensureSupabase(scope: string) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error(`${scope} requires an active Supabase project.`);
  }
}

async function insertSupabaseBooking(input: BookingInput) {
  ensureSupabase("Booking");
  const record = supabaseBookingFromInput(input);
  const { error } = await supabase!
    .from("bookings")
    .insert({
      id: record.id,
      user_id: record.user_id,
      category: record.category,
      service_slug: record.service_slug,
      service_name: record.service_name,
      booking_date: record.booking_date,
      booking_time: record.booking_time,
      duration_minutes: record.duration_minutes,
      appointment_start_at: record.appointment_start_at,
      appointment_end_at: record.appointment_end_at,
      name: record.name,
      email: record.email,
      whatsapp: record.whatsapp,
      notes: record.notes,
      preferred_therapist: record.preferred_therapist,
      source: record.source,
      metadata: record.metadata,
    });

  if (error) throw toAppError("booking", error);
  return normalizeBooking(record);
}

async function insertSupabaseLead(input: LeadInput) {
  ensureSupabase("Lead capture");
  const record = supabaseLeadFromInput(input);
  const { error } = await supabase!
    .from("lead_submissions")
    .insert({
      id: record.id,
      user_id: record.user_id,
      lead_type: record.lead_type,
      source: record.source,
      name: record.name,
      email: record.email,
      whatsapp: record.whatsapp,
      message: record.message,
      metadata: record.metadata,
    });

  if (error) throw toAppError("lead", error);
  return normalizeLead(record);
}

async function insertSupabaseOrder(input: CheckoutInput) {
  ensureSupabase("Checkout");
  const created = supabaseOrderFromInput(input);
  const { error: orderError } = await supabase!
    .from("orders")
    .insert({
      id: created.order.id,
      order_number: created.order.order_number,
      user_id: created.order.user_id,
      customer_name: created.order.customer_name,
      email: created.order.email,
      phone: created.order.phone,
      delivery_address: created.order.delivery_address,
      city: created.order.city,
      state: created.order.state,
      notes: created.order.notes,
      subtotal_ngn: created.order.subtotal_ngn,
      delivery_fee_ngn: created.order.delivery_fee_ngn,
      total_ngn: created.order.total_ngn,
      metadata: created.order.metadata,
    });

  if (orderError) throw toAppError("order", orderError);

  const rows = created.items.map((item) => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    product_slug: item.product_slug,
    product_name: item.product_name,
    unit_price_ngn: item.unit_price_ngn,
    quantity: item.quantity,
    line_total_ngn: item.line_total_ngn,
  }));

  const { error: itemsError } = await supabase!
    .from("order_items")
    .insert(rows)
    ;

  if (itemsError) throw toAppError("order", itemsError);

  return {
    order: normalizeOrder(created.order),
    items: created.items.map((item) => normalizeOrderItem(item)),
  };
}

function logFallbackError(scope: string, error: unknown) {
  console.warn(`[loofah-store] Falling back to local ${scope} persistence`, error);
}

export async function saveBooking(
  input: BookingInput,
  options: PersistOptions = {},
): Promise<{ mode: StorageMode; record: BookingRecord }> {
  if (hasSupabaseConfig && supabase) {
    try {
      const record = await insertSupabaseBooking(input);
      return { mode: "supabase", record };
    } catch (error) {
      if (options.requireSupabase) throw error;
      logFallbackError("booking", error);
    }
  } else if (options.requireSupabase) {
    ensureSupabase("Booking");
  }

  const record = appendLocal(STORAGE_KEYS.bookings, localBookingFromInput(input));
  return { mode: "local", record };
}

export async function saveLead(
  input: LeadInput,
  options: PersistOptions = {},
): Promise<{ mode: StorageMode; record: LeadRecord }> {
  if (hasSupabaseConfig && supabase) {
    try {
      const record = await insertSupabaseLead(input);
      return { mode: "supabase", record };
    } catch (error) {
      if (options.requireSupabase) throw error;
      logFallbackError("lead", error);
    }
  } else if (options.requireSupabase) {
    ensureSupabase("Lead capture");
  }

  const record = appendLocal(STORAGE_KEYS.leads, localLeadFromInput(input));
  return { mode: "local", record };
}

export async function createOrder(
  input: CheckoutInput,
  options: PersistOptions = {},
): Promise<{ mode: StorageMode; order: OrderRecord; items: OrderItemRecord[] }> {
  if (hasSupabaseConfig && supabase) {
    try {
      const created = await insertSupabaseOrder(input);
      return { mode: "supabase", ...created };
    } catch (error) {
      if (options.requireSupabase) throw error;
      logFallbackError("order", error);
    }
  } else if (options.requireSupabase) {
    ensureSupabase("Checkout");
  }

  const created = localOrderFromInput(input);
  appendLocal(STORAGE_KEYS.orders, created);
  return { mode: "local", ...created };
}

export async function fetchShopProducts(): Promise<{ mode: StorageMode; products: ShopProductRecord[] }> {
  if (hasSupabaseConfig && supabase) {
    try {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      const products = (data ?? []).map((item) =>
        normalizeProduct(item as ShopProductRecord),
      );

      if (products.length > 0) {
        return { mode: "supabase", products };
      }
    } catch (error) {
      logFallbackError("product", error);
    }
  }

  return { mode: "local", products: SHOP_PRODUCTS };
}

export async function fetchProfile(userId: string): Promise<ProfileRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[loofah-store] Profile fetch failed", error);
    return null;
  }

  return data ? toProfileRecord(data as ProfileRecord) : null;
}

export async function upsertProfile(
  userId: string,
  patch: Partial<
    Pick<
      ProfileRecord,
      | "full_name"
      | "email"
      | "whatsapp"
      | "avatar_url"
      | "city"
      | "state"
      | "preferred_contact"
      | "skin_goals"
      | "visit_intake_completed_at"
    >
  >,
) {
  ensureSupabase("Profile updates");

  const payload = toRecordPatch({
    id: userId,
    ...patch,
  });

  const { data, error } = await supabase!
    .from("profiles")
    .upsert(payload)
    .select("*")
    .single();

  if (error) throw toAppError("profile", error);
  return toProfileRecord(data as ProfileRecord);
}

export async function fetchUserRole(userId: string): Promise<UserRoleRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[loofah-store] Role fetch failed", error);
    return null;
  }

  return (data as UserRoleRecord | null) ?? null;
}

export async function fetchBookedSlots(date: string): Promise<string[]> {
  if (hasSupabaseConfig && supabase) {
    try {
      const { data, error } = await supabase.rpc("get_booked_slots", { target_date: date });
      if (error) throw error;
      return (data ?? [])
        .map((item) => {
          if (typeof item === "string") return item;
          if (typeof item === "object" && item !== null && "booking_time" in item) {
            return String(item.booking_time);
          }
          return "";
        })
        .filter(Boolean);
    } catch (error) {
      logFallbackError("availability", error);
    }
  }

  return readLocal<BookingRecord>(STORAGE_KEYS.bookings)
    .map((item) => normalizeBooking(item))
    .filter(
      (item) =>
        item.booking_date === date &&
        (item.status === "pending" || item.status === "confirmed"),
    )
    .map((item) => item.booking_time);
}

function localDashboardSnapshot(): DashboardSnapshot {
  const bookings = readLocal<BookingRecord>(STORAGE_KEYS.bookings).map((item) => normalizeBooking(item));
  const leads = readLocal<LeadRecord>(STORAGE_KEYS.leads).map((item) => normalizeLead(item));
  const orders = readLocal<{ order: OrderRecord; items: OrderItemRecord[] }>(STORAGE_KEYS.orders).map((item) =>
    normalizeOrder(item.order),
  );
  const products = SHOP_PRODUCTS.map((item) => normalizeProduct(item));
  const today = new Date().toISOString().slice(0, 10);

  return {
    metrics: {
      bookings: bookings.length,
      leads: leads.length,
      orders: orders.length,
      revenue: orders.reduce((total, order) => total + Number(order.total_ngn), 0),
      intakeContacts: leads.filter((lead) => lead.lead_type === "visitor_intake").length,
      upcomingBookings: bookings.filter(
        (booking) =>
          booking.booking_date >= today &&
          (booking.status === "pending" || booking.status === "confirmed"),
      ).length,
    },
    bookings: bookings.slice(0, 80),
    leads: leads.slice(0, 120),
    orders: orders.slice(0, 80),
    products,
  };
}

export async function fetchDashboardSnapshot(): Promise<{ mode: StorageMode; snapshot: DashboardSnapshot }> {
  if (hasSupabaseConfig && supabase) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const [
        bookingsCountResult,
        leadsCountResult,
        intakeCountResult,
        ordersCountResult,
        upcomingBookingsResult,
        bookingsResult,
        leadsResult,
        ordersResult,
        revenueResult,
        productsResult,
      ] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("lead_submissions").select("id", { count: "exact", head: true }),
        supabase
          .from("lead_submissions")
          .select("id", { count: "exact", head: true })
          .eq("lead_type", "visitor_intake"),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "confirmed"])
          .gte("booking_date", today),
        supabase.from("bookings").select("*").order("appointment_start_at", { ascending: true }).limit(120),
        supabase.from("lead_submissions").select("*").order("created_at", { ascending: false }).limit(160),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(120),
        supabase.from("orders").select("total_ngn"),
        supabase.from("shop_products").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false }),
      ]);

      if (bookingsCountResult.error) throw bookingsCountResult.error;
      if (leadsCountResult.error) throw leadsCountResult.error;
      if (intakeCountResult.error) throw intakeCountResult.error;
      if (ordersCountResult.error) throw ordersCountResult.error;
      if (upcomingBookingsResult.error) throw upcomingBookingsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;
      if (leadsResult.error) throw leadsResult.error;
      if (ordersResult.error) throw ordersResult.error;
      if (revenueResult.error) throw revenueResult.error;
      if (productsResult.error) throw productsResult.error;

      const normalizedBookings = (bookingsResult.data ?? []).map((item) =>
        normalizeBooking(item as BookingRecord),
      );
      const normalizedLeads = (leadsResult.data ?? []).map((item) => normalizeLead(item as LeadRecord));
      const normalizedOrders = (ordersResult.data ?? []).map((item) => normalizeOrder(item as OrderRecord));
      const normalizedProducts = (productsResult.data ?? []).map((item) =>
        normalizeProduct(item as ShopProductRecord),
      );

      const snapshot: DashboardSnapshot = {
        metrics: {
          bookings: bookingsCountResult.count ?? normalizedBookings.length,
          leads: leadsCountResult.count ?? normalizedLeads.length,
          orders: ordersCountResult.count ?? normalizedOrders.length,
          revenue: (revenueResult.data ?? []).reduce(
            (total, item) => total + Number(item.total_ngn ?? 0),
            0,
          ),
          intakeContacts: intakeCountResult.count ?? normalizedLeads.filter((lead) => lead.lead_type === "visitor_intake").length,
          upcomingBookings: upcomingBookingsResult.count ?? normalizedBookings.filter(
            (booking) =>
              booking.booking_date >= today &&
              (booking.status === "pending" || booking.status === "confirmed"),
          ).length,
        },
        bookings: normalizedBookings,
        leads: normalizedLeads,
        orders: normalizedOrders,
        products: normalizedProducts,
      };

      return { mode: "supabase", snapshot };
    } catch (error) {
      logFallbackError("dashboard", error);
    }
  }

  return { mode: "local", snapshot: localDashboardSnapshot() };
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase!
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select("*")
      .single();

    if (error) throw toAppError("booking", error);
    return normalizeBooking(data as BookingRecord);
  }

  const updated = updateLocalCollection<BookingRecord>(STORAGE_KEYS.bookings, bookingId, (value) =>
    normalizeBooking({ ...value, status, updated_at: nowIso() }),
  );

  if (!updated) throw new Error("Booking not found.");
  return normalizeBooking(updated);
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase!
      .from("lead_submissions")
      .update({ status })
      .eq("id", leadId)
      .select("*")
      .single();

    if (error) throw toAppError("lead", error);
    return normalizeLead(data as LeadRecord);
  }

  const updated = updateLocalCollection<LeadRecord>(STORAGE_KEYS.leads, leadId, (value) =>
    normalizeLead({ ...value, status }),
  );

  if (!updated) throw new Error("Lead not found.");
  return normalizeLead(updated);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (hasSupabaseConfig && supabase) {
    const { data, error } = await supabase!
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("*")
      .single();

    if (error) throw toAppError("order", error);
    return normalizeOrder(data as OrderRecord);
  }

  const localOrders = readLocal<{ order: OrderRecord; items: OrderItemRecord[] }>(STORAGE_KEYS.orders);
  const nextOrders = localOrders.map((entry) =>
    entry.order.id === orderId
      ? { ...entry, order: normalizeOrder({ ...entry.order, status, updated_at: nowIso() }) }
      : entry,
  );
  writeLocal(STORAGE_KEYS.orders, nextOrders);
  const updated = nextOrders.find((entry) => entry.order.id === orderId)?.order;

  if (!updated) throw new Error("Order not found.");
  return normalizeOrder(updated);
}

export async function updateProductInventory(productId: string, inventoryCount: number) {
  ensureSupabase("Inventory updates");

  const nextCount = Math.max(0, Math.floor(inventoryCount));
  const { data, error } = await supabase!
    .from("shop_products")
    .update({
      inventory_count: nextCount,
      in_stock: nextCount > 0,
    })
    .eq("id", productId)
    .select("*")
    .single();

  if (error) throw toAppError("inventory", error);
  return normalizeProduct(data as ShopProductRecord);
}
