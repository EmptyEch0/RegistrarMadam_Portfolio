-- ====================================================================
-- VISITOR ACCESS LOGS TABLE FOR COURSES & PUZZLES
-- Run in Supabase SQL Editor to enable cloud logging across all devices
-- ====================================================================

create table if not exists public.visitor_logs (
  id             text primary key,
  visitor_name   text not null,
  visitor_email  text not null,
  accessed_item  text not null,
  access_type    text not null default 'course', -- 'course' | 'puzzle' | 'general'
  created_at     timestamptz not null default now()
);

-- Index for fast ordering by time
create index if not exists visitor_logs_created_at_idx
  on public.visitor_logs (created_at desc);

-- Enable Row Level Security
alter table public.visitor_logs enable row level security;

-- Allow public (anon & authenticated) to insert visitor logs
drop policy if exists "Anyone can insert visitor logs" on public.visitor_logs;
create policy "Anyone can insert visitor logs"
  on public.visitor_logs for insert
  to anon, authenticated
  with check (true);

-- Allow public to select visitor logs
drop policy if exists "Anyone can read visitor logs" on public.visitor_logs;
create policy "Anyone can read visitor logs"
  on public.visitor_logs for select
  to anon, authenticated
  using (true);

-- Allow authenticated/service role to delete logs
drop policy if exists "Service role can delete visitor logs" on public.visitor_logs;
create policy "Service role can delete visitor logs"
  on public.visitor_logs for delete
  to anon, authenticated
  using (true);

grant select, insert, delete on public.visitor_logs to anon, authenticated;
