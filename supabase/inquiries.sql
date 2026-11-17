-- ====================================================================
-- CONTACT / REQUESTS INBOX (paper requests, thesis guidance, collaboration)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
--
-- Visitors can only SUBMIT. Nobody can read requests with the public key;
-- the admin page reads them through functions that check a secret key
-- stored in admin_secrets (a table the public API cannot read).
-- ====================================================================

create table if not exists public.inquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 120),
  email           text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  affiliation     text check (char_length(affiliation) <= 200),
  request_type    text not null check (request_type in ('paper', 'thesis', 'collaboration', 'talk', 'general')),
  reference_title text check (char_length(reference_title) <= 300),
  subject         text not null check (char_length(subject) between 1 and 200),
  message         text not null check (char_length(message) between 1 and 5000),
  status          text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at      timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "Anyone can submit an inquiry" on public.inquiries;
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert to anon, authenticated
  with check (status = 'new');
-- (no select/update/delete policies on purpose)

-- Secret store: RLS on with no policies = unreadable through the API
create table if not exists public.admin_secrets (
  name  text primary key,
  value text not null
);
alter table public.admin_secrets enable row level security;

create or replace function public.check_inquiries_key(p_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_key is null or not exists (
    select 1 from admin_secrets where name = 'inquiries_key' and value = p_key
  ) then
    raise exception 'invalid access key';
  end if;
end $$;

create or replace function public.admin_list_inquiries(p_key text)
returns setof public.inquiries language plpgsql security definer set search_path = public as $$
begin
  perform check_inquiries_key(p_key);
  return query select * from inquiries order by created_at desc;
end $$;

create or replace function public.admin_set_inquiry_status(p_key text, p_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform check_inquiries_key(p_key);
  update inquiries set status = p_status where id = p_id;
end $$;

create or replace function public.admin_delete_inquiry(p_key text, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform check_inquiries_key(p_key);
  delete from inquiries where id = p_id;
end $$;

revoke all on function public.check_inquiries_key(text) from public, anon, authenticated;
revoke all on function public.admin_list_inquiries(text) from public;
revoke all on function public.admin_set_inquiry_status(text, uuid, text) from public;
revoke all on function public.admin_delete_inquiry(text, uuid) from public;
grant execute on function public.admin_list_inquiries(text) to anon, authenticated;
grant execute on function public.admin_set_inquiry_status(text, uuid, text) to anon, authenticated;
grant execute on function public.admin_delete_inquiry(text, uuid) to anon, authenticated;

-- ===== SET YOUR ACCESS KEY (pick a long random phrase; do NOT commit it) =====
-- insert into public.admin_secrets (name, value) values ('inquiries_key', 'REPLACE-WITH-LONG-RANDOM-KEY')
--   on conflict (name) do update set value = excluded.value;
