-- ====================================================================
-- QLEARN CONTENT (syllabus, modules, videos, notes, PPTs) + PDF BUCKET
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
-- ====================================================================

-- Single row (id = 'domains') holding the whole QLearn course tree as JSON.
create table if not exists public.qlearn_content (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.qlearn_content enable row level security;

drop policy if exists "Allow public select on qlearn_content" on public.qlearn_content;
create policy "Allow public select on qlearn_content"
  on public.qlearn_content for select to anon, authenticated using (true);

-- Same write model as the other admin tables (admin panel uses the anon key)
drop policy if exists "Allow insert on qlearn_content" on public.qlearn_content;
create policy "Allow insert on qlearn_content"
  on public.qlearn_content for insert to anon, authenticated with check (true);

drop policy if exists "Allow update on qlearn_content" on public.qlearn_content;
create policy "Allow update on qlearn_content"
  on public.qlearn_content for update to anon, authenticated using (true);

-- Public bucket for lecture-note PDFs (20 MB per file)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('qlearn', 'qlearn', true, 20971520, array['application/pdf'])
on conflict (id) do update set public = true;
