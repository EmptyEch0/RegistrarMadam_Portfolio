-- ====================================================================
-- CREATE PROJECTS TABLE IN SUPABASE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
-- ====================================================================

create table if not exists public.projects (
  id          text primary key,
  title       text not null,
  description text not null,
  category    text not null default 'Educational Platform',
  live_url    text,
  github_url  text,
  image_url   text,
  tags        text[] default array[]::text[],
  status      text default 'Live',
  featured    boolean default false,
  year        text default '2026',
  developers  jsonb default '[]'::jsonb,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- 1. Allow everyone (public visitors & students) to view all projects
drop policy if exists "Allow public select on projects" on public.projects;
create policy "Allow public select on projects"
  on public.projects for select
  to anon, authenticated
  using (true);

-- 2. Allow insert on projects
drop policy if exists "Allow insert on projects" on public.projects;
create policy "Allow insert on projects"
  on public.projects for insert
  to anon, authenticated
  with check (true);

-- 3. Allow update on projects
drop policy if exists "Allow update on projects" on public.projects;
create policy "Allow update on projects"
  on public.projects for update
  to anon, authenticated
  using (true);

-- 4. Allow delete on projects
drop policy if exists "Allow delete on projects" on public.projects;
create policy "Allow delete on projects"
  on public.projects for delete
  to anon, authenticated
  using (true);

-- Grant privileges
grant select, insert, update, delete on public.projects to anon, authenticated;
