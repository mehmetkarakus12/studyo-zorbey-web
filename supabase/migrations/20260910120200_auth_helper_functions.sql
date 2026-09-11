-- RLS politikalarında kullanılacak rol kontrol fonksiyonları.
-- `security definer` ile tanımlanır ki bir politika içinden çağrıldığında
-- `profiles` tablosunun kendi RLS'i tarafından engellenmesin (aksi halde
-- sonsuz döngüye benzer bir engellemeye yol açar). `search_path` sabitlenir
-- ki SECURITY DEFINER fonksiyonlarında bilinen arama yolu (search_path)
-- enjeksiyonu riski oluşmasın.

create or replace function public.is_admin_or_editor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

comment on function public.is_admin_or_editor() is
  'İçerik tablolarında (services, portfolio, blog, vb.) admin/editor yetkisi kontrolü için kullanılır.';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'Sadece admin''e özel işlemler (ör. profil yönetimi) için kullanılır.';
