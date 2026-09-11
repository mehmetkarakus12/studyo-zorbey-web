-- videos

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  description text,
  thumbnail_url text,
  video_url text not null,
  video_type text not null default 'youtube'
    check (video_type in ('youtube', 'vimeo', 'mp4', 'other')),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint videos_slug_key unique (slug)
);

comment on table public.videos is 'Cinematic video / highlight reel içerikleri.';

create index videos_active_sort_idx on public.videos (is_active, sort_order);
create index videos_featured_idx on public.videos (is_featured) where is_featured = true;

create trigger set_videos_updated_at
  before update on public.videos
  for each row
  execute function public.set_updated_at();
