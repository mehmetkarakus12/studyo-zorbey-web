-- profiles
-- Auth kurulacağı Faz 2.2'de dolacak admin/editor kullanıcı profilleri.
-- `id`, Supabase Auth'un kendi `auth.users` tablosuna 1:1 bağlanır; bir
-- auth kullanıcısı silinirse profili de otomatik silinir (cascade), çünkü
-- profilsiz bir auth kullanıcısının bu sistemde bir anlamı yoktur.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Admin paneli kullanıcı profilleri (auth.users''i genişletir). Faz 2.2''de auth akışıyla birlikte devreye girer.';

create index profiles_role_idx on public.profiles (role);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
