-- testimonials

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  shooting_type text,
  event_date date,
  content text not null,
  rating smallint check (rating between 1 and 5),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.testimonials is
  'Müşteri yorumları. NOT: gerçek müşteri onayı olmadan buraya veri girilmemeli (bkz. proje kuralları).';

create index testimonials_active_sort_idx on public.testimonials (is_active, sort_order);
create index testimonials_featured_idx on public.testimonials (is_featured) where is_featured = true;

create trigger set_testimonials_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_updated_at();
