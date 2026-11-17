-- ====================================================================
-- CREATE TEXTBOOKS TABLE IN SUPABASE (Publications → Textbooks tab)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
-- ====================================================================

create table if not exists public.textbooks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  authors     text not null,
  publisher   text,
  isbn        text,
  edition     text,
  kind        text not null default 'book' check (kind in ('book', 'chapter')),
  year        int,
  link        text,
  created_at  timestamptz not null default now()
);

alter table public.textbooks enable row level security;

drop policy if exists "Allow public select on textbooks" on public.textbooks;
create policy "Allow public select on textbooks"
  on public.textbooks for select to anon, authenticated using (true);

-- Same write model as the other admin tables (admin panel uses the anon key)
drop policy if exists "Allow insert on textbooks" on public.textbooks;
create policy "Allow insert on textbooks"
  on public.textbooks for insert to anon, authenticated with check (true);

drop policy if exists "Allow update on textbooks" on public.textbooks;
create policy "Allow update on textbooks"
  on public.textbooks for update to anon, authenticated using (true);

drop policy if exists "Allow delete on textbooks" on public.textbooks;
create policy "Allow delete on textbooks"
  on public.textbooks for delete to anon, authenticated using (true);
