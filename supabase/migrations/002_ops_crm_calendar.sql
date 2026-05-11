alter table public.profiles
  add column if not exists email text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists preferred_contact text check (
    preferred_contact is null or preferred_contact in ('whatsapp', 'phone', 'email')
  ),
  add column if not exists skin_goals text,
  add column if not exists visit_intake_completed_at timestamptz;

update public.profiles as profiles
set email = users.email
from auth.users as users
where users.id = profiles.id
  and profiles.email is null;

alter table public.lead_submissions
  drop constraint if exists lead_submissions_lead_type_check;

alter table public.lead_submissions
  add constraint lead_submissions_lead_type_check
  check (lead_type in ('contact', 'consultation', 'membership', 'checkout', 'visitor_intake'));

alter table public.bookings
  add column if not exists duration_minutes integer not null default 60 check (duration_minutes > 0 and duration_minutes <= 360),
  add column if not exists appointment_start_at timestamptz,
  add column if not exists appointment_end_at timestamptz,
  add column if not exists preferred_therapist text,
  add column if not exists source text not null default 'website';

update public.bookings
set
  appointment_start_at = coalesce(
    appointment_start_at,
    make_timestamptz(
      extract(year from booking_date)::integer,
      extract(month from booking_date)::integer,
      extract(day from booking_date)::integer,
      split_part(booking_time, ':', 1)::integer,
      split_part(booking_time, ':', 2)::integer,
      0,
      'Africa/Lagos'
    )
  ),
  appointment_end_at = coalesce(
    appointment_end_at,
    make_timestamptz(
      extract(year from booking_date)::integer,
      extract(month from booking_date)::integer,
      extract(day from booking_date)::integer,
      split_part(booking_time, ':', 1)::integer,
      split_part(booking_time, ':', 2)::integer,
      0,
      'Africa/Lagos'
    ) + make_interval(mins => duration_minutes)
  );

create unique index if not exists bookings_active_slot_key
on public.bookings (booking_date, booking_time)
where status in ('pending', 'confirmed');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do update
  set
    full_name = case
      when coalesce(public.profiles.full_name, '') = ''
        then excluded.full_name
      else public.profiles.full_name
    end,
    email = coalesce(public.profiles.email, excluded.email);

  insert into public.user_roles (user_id, role)
  values (new.id, 'client')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function public.get_booked_slots(target_date date)
returns table (booking_time text)
language sql
stable
security definer
set search_path = public
as $$
  select bookings.booking_time
  from public.bookings
  where bookings.booking_date = target_date
    and bookings.status in ('pending', 'confirmed')
  order by bookings.booking_time asc;
$$;

grant execute on function public.get_booked_slots(date) to anon, authenticated;
