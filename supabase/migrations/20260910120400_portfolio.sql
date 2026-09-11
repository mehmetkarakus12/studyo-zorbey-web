-- portfolio_categories, portfolio_projects, portfolio_images

create table public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_categories_slug_key unique (slug)
);

comment on table public.portfolio_categories is 'Portfolyo kategorileri (ör. Düğün, Nişan, Dış Çekim).';

create index portfolio_categories_active_sort_idx
  on public.portfolio_categories (is_active, sort_order);

create trigger set_portfolio_categories_updated_at
  before update on public.portfolio_categories
  for each row
  execute function public.set_updated_at();

-- Bir kategori silinmek istendiğinde, o kategoriye bağlı projeler varsa
-- silme işlemi RESTRICT ile engellenir. Bunun nedeni: kategori projelerin
-- portfolyo navigasyonunda (ör. /portfolyo/[kategori]) yapısal bir parçası
-- olduğu için, sessizce "kategorisiz" kalan projelerin URL/SEO açısından
-- fark edilmeden bozulmasını istemiyoruz — admin önce projeleri başka bir
-- kategoriye taşımalı ya da açıkça silmelidir.
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.portfolio_categories (id) on delete restrict,
  title text not null,
  slug text not null,
  location text,
  shooting_date date,
  short_description text,
  description text,
  cover_image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_projects_slug_key unique (slug)
);

comment on table public.portfolio_projects is 'Portfolyo projeleri (tekil çekimler/işler).';

create index portfolio_projects_active_sort_idx
  on public.portfolio_projects (is_active, sort_order);
create index portfolio_projects_category_id_idx
  on public.portfolio_projects (category_id);
create index portfolio_projects_featured_idx
  on public.portfolio_projects (is_featured) where is_featured = true;

create trigger set_portfolio_projects_updated_at
  before update on public.portfolio_projects
  for each row
  execute function public.set_updated_at();

-- Bir proje silinirse, o projeye ait galeri görsellerinin DB kayıtlarının
-- tek başına anlamı kalmaz (dosyalar zaten Supabase Storage'da proje
-- klasöründe tutulacak); bu yüzden CASCADE ile birlikte silinirler.
create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_projects (id) on delete cascade,
  image_url text not null,
  alt_text text,
  width integer,
  height integer,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.portfolio_images is 'Bir portfolyo projesine ait galeri görselleri.';

create index portfolio_images_project_id_idx on public.portfolio_images (project_id);
create index portfolio_images_project_sort_idx
  on public.portfolio_images (project_id, sort_order);
