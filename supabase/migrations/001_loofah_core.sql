create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  whatsapp text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'staff', 'admin')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  lead_type text not null check (lead_type in ('contact', 'consultation', 'membership', 'checkout')),
  source text not null default 'website',
  name text not null,
  email text,
  whatsapp text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  category text,
  service_slug text not null,
  service_name text not null,
  booking_date date not null,
  booking_time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  name text not null,
  email text,
  whatsapp text not null,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  subtitle text,
  description text not null,
  image_url text not null,
  price_ngn numeric(12,2) not null check (price_ngn >= 0),
  compare_at_ngn numeric(12,2) check (compare_at_ngn is null or compare_at_ngn >= 0),
  featured boolean not null default false,
  in_stock boolean not null default true,
  inventory_count integer not null default 0,
  instagram_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  random_part text;
begin
  random_part := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));
  return 'LSA-' || to_char(timezone('utc'::text, now()), 'YYYYMMDD') || '-' || random_part;
end;
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default public.generate_order_number(),
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  delivery_address text not null,
  city text not null,
  state text not null,
  notes text,
  subtotal_ngn numeric(12,2) not null check (subtotal_ngn >= 0),
  delivery_fee_ngn numeric(12,2) not null default 0 check (delivery_fee_ngn >= 0),
  total_ngn numeric(12,2) not null check (total_ngn >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'fulfilled', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'pending', 'paid', 'refunded')),
  payment_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.shop_products (id) on delete set null,
  product_slug text not null,
  product_name text not null,
  unit_price_ngn numeric(12,2) not null check (unit_price_ngn >= 0),
  quantity integer not null check (quantity > 0),
  line_total_ngn numeric(12,2) not null check (line_total_ngn >= 0),
  created_at timestamptz not null default timezone('utc'::text, now())
);

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

drop trigger if exists shop_products_touch_updated_at on public.shop_products;
create trigger shop_products_touch_updated_at
before update on public.shop_products
for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'client')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.bookings enable row level security;
alter table public.shop_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_self_insert" on public.profiles;
create policy "profiles_self_insert"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "user_roles_self_read" on public.user_roles;
create policy "user_roles_self_read"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_roles_admin_manage" on public.user_roles;
create policy "user_roles_admin_manage"
on public.user_roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "leads_public_insert" on public.lead_submissions;
create policy "leads_public_insert"
on public.lead_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "leads_admin_read" on public.lead_submissions;
create policy "leads_admin_read"
on public.lead_submissions
for select
to authenticated
using (public.is_admin());

drop policy if exists "leads_admin_update" on public.lead_submissions;
create policy "leads_admin_update"
on public.lead_submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "bookings_public_insert" on public.bookings;
create policy "bookings_public_insert"
on public.bookings
for insert
to anon, authenticated
with check (true);

drop policy if exists "bookings_owner_or_admin_read" on public.bookings;
create policy "bookings_owner_or_admin_read"
on public.bookings
for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "bookings_admin_update" on public.bookings;
create policy "bookings_admin_update"
on public.bookings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products_public_read" on public.shop_products;
create policy "products_public_read"
on public.shop_products
for select
to anon, authenticated
using (true);

drop policy if exists "products_admin_manage" on public.shop_products;
create policy "products_admin_manage"
on public.shop_products
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert"
on public.orders
for insert
to anon, authenticated
with check (user_id is null or user_id = auth.uid());

drop policy if exists "orders_owner_or_admin_read" on public.orders;
create policy "orders_owner_or_admin_read"
on public.orders
for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert"
on public.order_items
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id is null or orders.user_id = auth.uid())
  )
);

drop policy if exists "order_items_owner_or_admin_read" on public.order_items;
create policy "order_items_owner_or_admin_read"
on public.order_items
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

insert into public.shop_products (
  slug,
  name,
  category,
  subtitle,
  description,
  image_url,
  price_ngn,
  compare_at_ngn,
  featured,
  in_stock,
  inventory_count,
  instagram_url
)
values
  (
    'radiance-cleansing-oil',
    'Radiance Cleansing Oil',
    'Cleanse',
    'Silk melt for SPF, makeup and city residue.',
    'A weightless botanical cleansing oil that melts sunscreen, makeup and pollution without stripping the skin barrier.',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    28500,
    32000,
    true,
    true,
    18,
    'https://instagram.com/loofahspaabuja'
  ),
  (
    'enzyme-polish-powder',
    'Enzyme Polish Powder',
    'Exfoliate',
    'Water-activated glow reset for textured skin.',
    'A rice-enzyme powder cleanser that brightens, smooths and keeps congestion low without harsh scrubs.',
    'https://images.unsplash.com/photo-1556228720-da4e85f25e72?auto=format&fit=crop&w=1200&q=80',
    24000,
    null,
    false,
    true,
    22,
    'https://instagram.com/loofahspaabuja'
  ),
  (
    'vitamin-c-essence',
    'Vitamin C Essence',
    'Brighten',
    'Daily glow concentrate for uneven tone.',
    'A stable antioxidant essence designed to support brightness, reduce dullness and defend against environmental stress.',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80',
    36000,
    40000,
    true,
    true,
    12,
    'https://instagram.com/loofahspaabuja'
  ),
  (
    'barrier-repair-cream',
    'Barrier Repair Cream',
    'Moisturise',
    'Cushioning comfort for sensitive, post-treatment skin.',
    'Ceramides, cholesterol and peptides rebuild resilience after peels, lasers and dry harmattan weeks.',
    'https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?auto=format&fit=crop&w=1200&q=80',
    34500,
    null,
    false,
    true,
    16,
    'https://instagram.com/loofahspaabuja'
  ),
  (
    'overnight-renewal-mask',
    'Overnight Renewal Mask',
    'Treat',
    'Sleep-in resurfacing veil for weekend radiance.',
    'A low-irritation overnight mask with lactic acid and niacinamide that wakes up tired skin looking freshly polished.',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    42000,
    46000,
    true,
    true,
    9,
    'https://instagram.com/loofahspaabuja'
  ),
  (
    'daily-sheer-spf50',
    'Daily Sheer SPF 50',
    'Protect',
    'No-cast broad-spectrum finish for melanin-rich skin.',
    'A lightweight sunscreen with an invisible finish, humidity-friendly feel and elegant layering under makeup.',
    'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1200&q=80',
    31000,
    null,
    true,
    true,
    28,
    'https://instagram.com/loofahspaabuja'
  )
on conflict (slug) do update
set
  name = excluded.name,
  category = excluded.category,
  subtitle = excluded.subtitle,
  description = excluded.description,
  image_url = excluded.image_url,
  price_ngn = excluded.price_ngn,
  compare_at_ngn = excluded.compare_at_ngn,
  featured = excluded.featured,
  in_stock = excluded.in_stock,
  inventory_count = excluded.inventory_count,
  instagram_url = excluded.instagram_url,
  updated_at = timezone('utc'::text, now());
