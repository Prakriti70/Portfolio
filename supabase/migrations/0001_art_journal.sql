-- Art Journal schema, storage bucket and security policies.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Who is an admin?
-- Signing in is not enough to edit the gallery: your user id must be in this table.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "admins can read their own row" on public.admins;
create policy "admins can read their own row"
  on public.admins for select to authenticated
  using (user_id = auth.uid());
-- No insert/update/delete policies on purpose: admins are added by you in the SQL editor.

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Artwork metadata
-- ---------------------------------------------------------------------------
create table if not exists public.artworks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  category    text not null check (category in
                ('Paintings','Sketches','Digital','Writing','Crafts','Experiments')),
  medium      text check (medium is null or char_length(medium) <= 80),
  made_on     date,
  description text not null default '' check (char_length(description) <= 1000),
  note        text check (note is null or char_length(note) <= 1500),
  body        text check (body is null or char_length(body) <= 5000),
  image_path  text,   -- path inside the "artwork" bucket (full-size)
  thumb_path  text,   -- path inside the "artwork" bucket (smaller, for the grid)
  width       integer check (width is null or width > 0),
  height      integer check (height is null or height > 0),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  -- every entry needs something to show: an image, or written text
  constraint artwork_has_content check (image_path is not null or body is not null)
);
create index if not exists artworks_sort_idx on public.artworks (sort_order, created_at desc);

alter table public.artworks enable row level security;

drop policy if exists "anyone can view artwork" on public.artworks;
create policy "anyone can view artwork"
  on public.artworks for select to anon, authenticated using (true);

drop policy if exists "admins can add artwork" on public.artworks;
create policy "admins can add artwork"
  on public.artworks for insert to authenticated with check (public.is_admin());

drop policy if exists "admins can edit artwork" on public.artworks;
create policy "admins can edit artwork"
  on public.artworks for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins can delete artwork" on public.artworks;
create policy "admins can delete artwork"
  on public.artworks for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Image storage
-- Public bucket: anyone can VIEW images through their URL. Only admins can write.
-- The browser also resizes images before upload, but these limits are enforced server-side.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artwork', 'artwork', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins can upload artwork files" on storage.objects;
create policy "admins can upload artwork files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'artwork' and public.is_admin());

drop policy if exists "admins can replace artwork files" on storage.objects;
create policy "admins can replace artwork files"
  on storage.objects for update to authenticated
  using (bucket_id = 'artwork' and public.is_admin())
  with check (bucket_id = 'artwork' and public.is_admin());

drop policy if exists "admins can delete artwork files" on storage.objects;
create policy "admins can delete artwork files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'artwork' and public.is_admin());
