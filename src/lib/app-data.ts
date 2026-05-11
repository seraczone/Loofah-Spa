export type AppRole = "client" | "staff" | "admin";
export type LeadType = "contact" | "consultation" | "membership" | "checkout" | "visitor_intake";
export type LeadStatus = "new" | "contacted" | "qualified" | "closed";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type OrderStatus = "pending" | "processing" | "fulfilled" | "cancelled";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";
export type ContactPreference = "whatsapp" | "phone" | "email";

export interface ProfileRecord {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  preferred_contact: ContactPreference | null;
  skin_goals: string | null;
  visit_intake_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  user_id: string | null;
  lead_type: LeadType;
  source: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  message: string | null;
  status: LeadStatus;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BookingRecord {
  id: string;
  user_id: string | null;
  category: string | null;
  service_slug: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  duration_minutes: number;
  appointment_start_at: string | null;
  appointment_end_at: string | null;
  name: string;
  email: string | null;
  whatsapp: string;
  notes: string | null;
  preferred_therapist: string | null;
  source: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ShopProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  subtitle: string | null;
  description: string;
  image_url: string;
  price_ngn: number;
  compare_at_ngn: number | null;
  featured: boolean;
  in_stock: boolean;
  inventory_count: number;
  instagram_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  notes: string | null;
  subtotal_ngn: number;
  delivery_fee_ngn: number;
  total_ngn: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string;
  product_name: string;
  unit_price_ngn: number;
  quantity: number;
  line_total_ngn: number;
  created_at: string;
}

export interface BookingInput {
  user_id?: string | null;
  category?: string | null;
  service_slug: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration_minutes?: number;
  appointment_start_at?: string | null;
  appointment_end_at?: string | null;
  name: string;
  email?: string | null;
  whatsapp: string;
  notes?: string | null;
  preferred_therapist?: string | null;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface LeadInput {
  user_id?: string | null;
  lead_type: LeadType;
  source: string;
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  message?: string | null;
  metadata?: Record<string, unknown>;
}

export interface CheckoutInput {
  user_id?: string | null;
  customer_name: string;
  email: string;
  phone: string;
  delivery_address: string;
  city: string;
  state: string;
  notes?: string | null;
  subtotal_ngn: number;
  delivery_fee_ngn: number;
  total_ngn: number;
  metadata?: Record<string, unknown>;
  items: Array<{
    product_id?: string | null;
    product_slug: string;
    product_name: string;
    unit_price_ngn: number;
    quantity: number;
    line_total_ngn: number;
  }>;
}

export interface DashboardSnapshot {
  metrics: {
    bookings: number;
    leads: number;
    orders: number;
    revenue: number;
    intakeContacts: number;
    upcomingBookings: number;
  };
  bookings: BookingRecord[];
  leads: LeadRecord[];
  orders: OrderRecord[];
  products: ShopProductRecord[];
}
