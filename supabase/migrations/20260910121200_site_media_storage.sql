-- site-media Storage bucket + politikaları
--
-- Admin panelden yüklenen hizmet/portfolyo/blog/video kapak görselleri için
-- tek, ortak bucket. Klasör mantığı (uygulama tarafında path prefix'i ile
-- yönetilir, ayrı bir DB alanı gerekmez): services/, portfolio/, blog/,
-- video/, general/.
--
-- `public = true` yalnızca OKUMA (public object endpoint) için RLS'i
-- by-pass eder; bu sayede public sitedeki <img> etiketleri auth header'ı
-- olmadan görseli gösterebilir. INSERT/UPDATE/DELETE HER ZAMAN aşağıdaki
-- RLS politikalarına tabidir — public bayrağı yazma izni vermez.
-- `file_size_limit`/`allowed_mime_types` Storage API'nin kendisi
-- tarafından uygulanan gerçek sunucu taraflı kontrollerdir (istemci
-- tarafı kontrolü atlatılsa bile geçerlidir).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  8388608, -- 8 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- `public.is_admin_or_editor()` diğer tüm içerik tablolarında kullanılan
-- aynı rol kontrol fonksiyonudur (bkz. 20260910120200_auth_helper_functions.sql)
-- — Storage için ayrı bir yetki modeli icat edilmedi.

create policy "site_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create policy "site_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_admin_or_editor());

create policy "site_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin_or_editor())
  with check (bucket_id = 'site-media' and public.is_admin_or_editor());

create policy "site_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin_or_editor());
