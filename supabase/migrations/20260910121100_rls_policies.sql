-- Row Level Security (RLS)
--
-- Genel mantık:
--   1) RLS tüm tablolarda açık (enable) — varsayılan olarak HİÇBİR erişim yok.
--   2) Public (anon + authenticated), sadece "aktif/yayınlanmış" içerik
--      satırlarını okuyabilir.
--   3) Public, sadece appointments / quote_requests / contact_messages
--      tablolarına, sabit bir başlangıç durumuyla (status='new', notes=null)
--      kayıt (INSERT) ekleyebilir; bu satırları okuyamaz/güncelleyemez/silemez.
--   4) Public UPDATE/DELETE hiçbir tabloda YOKTUR.
--   5) `profiles`.role IN ('admin','editor') olan authenticated kullanıcılar
--      (public.is_admin_or_editor()) içerik tablolarında tam yetkilidir.
--      Bu politikalar Faz 2.1'de hazırlanır ama auth henüz kurulmadığından
--      (Faz 2.2) fiilen hiçbir kullanıcı bu koşulu sağlamaz — güvenli
--      "kapalı" başlangıç durumu budur.
--   6) `service_role` anahtarı (server-only, asla client'a çıkmaz) RLS'i
--      bypass eder; ileride admin API/route handler'ları bu anahtarla
--      çalışabilir, ama bu fazda herhangi bir server-only kod bu anahtarı
--      kullanmıyor.

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.videos enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.appointments enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_settings enable row level security;
alter table public.media enable row level security;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
-- Herkes kendi profilini görebilir/güncelleyebilir; admin hepsini yönetir.
-- Public (anon) hiçbir profili göremez.

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own_or_admin"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin_only"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------

create policy "services_public_read_active"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

create policy "services_admin_all"
  on public.services for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- portfolio_categories
-- ---------------------------------------------------------------------

create policy "portfolio_categories_public_read_active"
  on public.portfolio_categories for select
  to anon, authenticated
  using (is_active = true);

create policy "portfolio_categories_admin_all"
  on public.portfolio_categories for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- portfolio_projects
-- ---------------------------------------------------------------------

create policy "portfolio_projects_public_read_active"
  on public.portfolio_projects for select
  to anon, authenticated
  using (is_active = true);

create policy "portfolio_projects_admin_all"
  on public.portfolio_projects for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- portfolio_images
-- ---------------------------------------------------------------------
-- Görselin kendi is_active alanı yok; bağlı olduğu projenin aktif olması
-- yeterli ve gerekli koşuldur.

create policy "portfolio_images_public_read_via_active_project"
  on public.portfolio_images for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.portfolio_projects p
      where p.id = portfolio_images.project_id
        and p.is_active = true
    )
  );

create policy "portfolio_images_admin_all"
  on public.portfolio_images for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- videos
-- ---------------------------------------------------------------------

create policy "videos_public_read_active"
  on public.videos for select
  to anon, authenticated
  using (is_active = true);

create policy "videos_admin_all"
  on public.videos for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------
-- Kategorinin kendine ait bir is_active alanı yok; sadece yayınlanan
-- yazıları filtrelemek için referans olarak herkese açık okunabilir.

create policy "blog_categories_public_read"
  on public.blog_categories for select
  to anon, authenticated
  using (true);

create policy "blog_categories_admin_all"
  on public.blog_categories for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------

create policy "blog_posts_public_read_published"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');

create policy "blog_posts_admin_all"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------

create policy "testimonials_public_read_active"
  on public.testimonials for select
  to anon, authenticated
  using (is_active = true);

create policy "testimonials_admin_all"
  on public.testimonials for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- site_settings / seo_settings
-- ---------------------------------------------------------------------
-- Bu iki tablo yalnızca herkese açık, gizli olmayan alanlar içerir
-- (marka adı, telefon, sosyal medya linkleri, sayfa meta bilgileri) — bu
-- yüzden tamamı public read'e açıktır. Gelecekte gizli/idari bir ayar
-- eklenirse bu tablo yerine ayrı, admin-only bir tabloya taşınmalıdır.

create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "site_settings_admin_all"
  on public.site_settings for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

create policy "seo_settings_public_read"
  on public.seo_settings for select
  to anon, authenticated
  using (true);

create policy "seo_settings_admin_all"
  on public.seo_settings for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------
-- Medya kütüphanesi tablosu sadece admin/editor için okunur/yazılır.
-- Public, dosyaları bu tablo üzerinden değil, doğrudan Storage'ın public
-- URL'leri (diğer tablolardaki *_url kolonları) üzerinden görür.

create policy "media_admin_all"
  on public.media for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

-- ---------------------------------------------------------------------
-- appointments / quote_requests / contact_messages
-- ---------------------------------------------------------------------
-- Public sadece INSERT edebilir; status sabit 'new' olmalı ve notes boş
-- olmalıdır — aksi halde bir ziyaretçi kendi talebini "confirmed" gibi
-- işaretleyip veya admin notu yazıp gönderebilirdi. Public hiçbir zaman
-- bu tabloları okuyamaz/güncelleyemez/silemez; sadece admin/editor görür.

create policy "appointments_public_insert"
  on public.appointments for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);

create policy "appointments_admin_all"
  on public.appointments for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

create policy "quote_requests_public_insert"
  on public.quote_requests for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);

create policy "quote_requests_admin_all"
  on public.quote_requests for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'new');

create policy "contact_messages_admin_all"
  on public.contact_messages for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());
