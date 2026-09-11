-- blog_categories, blog_posts

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint blog_categories_slug_key unique (slug)
);

comment on table public.blog_categories is 'Blog yazı kategorileri.';

-- Bir kategori silindiğinde altındaki yazılar SİLİNMEZ; blog yazıları
-- (SEO/içerik değeri taşıdığı için) kategoriden bağımsız yaşamaya devam
-- eder ve sadece "kategorisiz" duruma düşer (category_id null). Bu,
-- portfolio_projects'teki RESTRICT davranışının aksine bilinçli olarak
-- daha esnek seçildi: blog kategorileri projelerin aksine URL yapısının
-- zorunlu bir parçası değildir.
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories (id) on delete set null,
  title text not null,
  slug text not null,
  excerpt text,
  content text,
  cover_image_url text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_key unique (slug)
);

comment on table public.blog_posts is 'Blog yazıları.';

create index blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);
create index blog_posts_category_id_idx on public.blog_posts (category_id);
create index blog_posts_featured_idx on public.blog_posts (is_featured) where is_featured = true;

create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_updated_at();
