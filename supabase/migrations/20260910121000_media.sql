-- media
-- Supabase Storage'a yüklenen dosyaların meta verisini (admin medya
-- kütüphanesi için) tutar. Asıl dosyalar Storage bucket'larında durur;
-- bu tablo sadece referans/metadata katmanıdır, bu yüzden herhangi bir
-- foreign key ile diğer tablolara bağlı değildir (image_url alanları
-- her tabloda doğrudan public_url metni olarak tutulur).

create table public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  public_url text not null,
  mime_type text not null,
  file_size bigint,
  width integer,
  height integer,
  alt_text text,
  folder text,
  created_at timestamptz not null default now()
);

comment on table public.media is 'Yüklenen medya dosyalarının (Supabase Storage) metadata kütüphanesi.';

create index media_folder_idx on public.media (folder);
create index media_created_at_idx on public.media (created_at desc);
