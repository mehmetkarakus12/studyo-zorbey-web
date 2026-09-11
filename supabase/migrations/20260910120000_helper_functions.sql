-- Ortak yardımcı fonksiyonlar
-- `updated_at` kolonu olan her tabloda kullanılacak paylaşılan trigger
-- fonksiyonu. Postgres 13+ üzerinde çalışan Supabase projelerinde
-- gen_random_uuid() çekirdek (core) fonksiyon olarak zaten mevcuttur,
-- bu yüzden ayrıca bir extension'a ihtiyaç yoktur.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE trigger''i: updated_at kolonunu her güncellemede now() ile eşitler.';
