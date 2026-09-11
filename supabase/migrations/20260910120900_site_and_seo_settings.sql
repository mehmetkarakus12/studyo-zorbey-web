-- site_settings, seo_settings
-- site_settings key/value (jsonb) olarak tasarlandı ki yeni bir ayar
-- eklemek için migration gerekmesin — sadece yeni bir `key` satırı
-- eklenir/güncellenir. `value` jsonb olduğu için hem düz metin (ör.
-- "phone") hem de yapılı veri (ör. "working_hours": {"mon": "09:00-18:00"})
-- aynı tabloda taşınabilir.

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is
  'Genel site ayarları (brand_name, phone, email, whatsapp, address, instagram_url, facebook_url, youtube_url, maps_embed, working_hours, vb.) key/value olarak.';

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

create table public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  updated_at timestamptz not null default now(),
  constraint seo_settings_page_key_key unique (page_key)
);

comment on table public.seo_settings is
  'Sayfa bazlı SEO/meta ayarları (page_key ör. "home", "hizmetler", "portfolyo/dugun-fotografcisi").';

create trigger set_seo_settings_updated_at
  before update on public.seo_settings
  for each row
  execute function public.set_updated_at();
