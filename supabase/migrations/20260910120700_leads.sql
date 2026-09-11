-- appointments, quote_requests, contact_messages
-- Bu üç tablo ileride (Faz 2.2+) public formlardan INSERT alacak. Bir
-- hizmet (service) silinse dahi geçmiş talep kayıtları iş/hukuki açıdan
-- saklanmalıdır; bu yüzden service_id SET NULL ile bağlanır, kayıtların
-- kendisi asla cascade ile silinmez.

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_id uuid references public.services (id) on delete set null,
  preferred_date date,
  preferred_time time,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.appointments is 'Randevu talepleri (public form ile Faz 2.2+''de doldurulacak).';

create index appointments_status_idx on public.appointments (status);
create index appointments_created_at_idx on public.appointments (created_at desc);
create index appointments_service_id_idx on public.appointments (service_id);

create trigger set_appointments_updated_at
  before update on public.appointments
  for each row
  execute function public.set_updated_at();

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_id uuid references public.services (id) on delete set null,
  event_date date,
  location text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.quote_requests is 'Fiyat teklifi talepleri (public form ile Faz 2.2+''de doldurulacak).';

create index quote_requests_status_idx on public.quote_requests (status);
create index quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index quote_requests_service_id_idx on public.quote_requests (service_id);

create trigger set_quote_requests_updated_at
  before update on public.quote_requests
  for each row
  execute function public.set_updated_at();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.contact_messages is 'İletişim formu mesajları (public form ile Faz 2.2+''de doldurulacak).';

create index contact_messages_status_idx on public.contact_messages (status);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

create trigger set_contact_messages_updated_at
  before update on public.contact_messages
  for each row
  execute function public.set_updated_at();
