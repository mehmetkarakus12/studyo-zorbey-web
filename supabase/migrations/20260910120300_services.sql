-- services

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  short_description text,
  description text,
  image_url text,
  icon text,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_key unique (slug)
);

comment on table public.services is 'Stüdyo Zorbey''in sunduğu hizmetler (düğün, nişan, kına, dış çekim, vb.).';

create index services_active_sort_idx on public.services (is_active, sort_order);
create index services_featured_idx on public.services (is_featured) where is_featured = true;

create trigger set_services_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();
