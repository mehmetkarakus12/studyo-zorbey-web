-- Yalnızca local/dev ortamı için iskelet (scaffold) veri.
-- `supabase db reset` çalıştırıldığında migration'ların ardından otomatik
-- uygulanır. Gerçek müşteri/marka içeriği İÇERMEZ — sadece site_settings
-- tablosunun hangi anahtarları (key) barındıracağını boş değerlerle
-- tanımlar; admin panel (ileriki faz) bu satırları gerçek değerlerle
-- güncelleyecektir.

insert into public.site_settings (key, value) values
  ('brand_name', '"Stüdyo Zorbey"'),
  ('phone', 'null'),
  ('email', 'null'),
  ('whatsapp', 'null'),
  ('address', 'null'),
  ('instagram_url', 'null'),
  ('facebook_url', 'null'),
  ('youtube_url', 'null'),
  ('maps_embed', 'null'),
  ('working_hours', '{}')
on conflict (key) do nothing;
