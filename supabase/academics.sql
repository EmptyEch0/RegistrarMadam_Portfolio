-- ====================================================================
-- ACADEMICS / STUDENT PORTAL: cross-device student accounts
-- Run AFTER student_assignments.sql (submissions + marks tables) and qlearn_content.sql.
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
--
-- Batches, assignments and the "publish marks" switch are stored as rows in
-- public.qlearn_content (ids: academic_batches, batch_assignments, marks_published).
-- ====================================================================

create extension if not exists pgcrypto with schema extensions;

-- RLS on with NO policies: the table is unreadable through the public API.
-- Everything goes through the security-definer functions below, which never return passwords.
create table if not exists public.student_accounts (
  id             text primary key,
  username       text not null unique,
  full_name      text not null,
  email          text,
  program        text not null,
  roll_no        text unique,
  destination    text,
  year           text,
  batch_year     text,
  branch         text,
  password_hash  text not null,
  created_at     timestamptz not null default now()
);
alter table public.student_accounts enable row level security;

create or replace function public.norm_roll(p text)
returns text language sql immutable as $$
  select upper(regexp_replace(trim(coalesce(p, '')), '[\s\-_]+', '', 'g'))
$$;

create or replace function public.student_account_json(a public.student_accounts)
returns json language sql stable as $$
  select json_build_object(
    'id', a.id, 'username', a.username, 'fullName', a.full_name, 'email', a.email,
    'program', a.program, 'rollNo', a.roll_no, 'destination', a.destination, 'year', a.year,
    'batchYear', a.batch_year, 'branch', a.branch, 'passwordHash', '', 'createdAt', a.created_at
  )
$$;

-- Returns {"status":"ok","account":{...}} | {"status":"username_taken"} | {"status":"roll_taken"}
create or replace function public.student_register(p jsonb)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare a public.student_accounts;
begin
  if exists (select 1 from student_accounts where lower(username) = lower(trim(p->>'username'))) then
    return json_build_object('status', 'username_taken');
  end if;
  if nullif(norm_roll(p->>'rollNo'), '') is not null
     and exists (select 1 from student_accounts where roll_no = norm_roll(p->>'rollNo')) then
    return json_build_object('status', 'roll_taken');
  end if;
  insert into student_accounts (id, username, full_name, email, program, roll_no, destination, year, batch_year, branch, password_hash)
  values (
    coalesce(p->>'id', gen_random_uuid()::text), lower(trim(p->>'username')), trim(p->>'fullName'), nullif(trim(p->>'email'), ''),
    p->>'program', nullif(norm_roll(p->>'rollNo'), ''), nullif(trim(p->>'destination'), ''), p->>'year', p->>'batchYear', p->>'branch',
    crypt(lower(p->>'password'), gen_salt('bf'))   -- passwords were always case-insensitive in the portal
  )
  returning * into a;
  return json_build_object('status', 'ok', 'account', student_account_json(a));
exception when unique_violation then
  -- two signups raced for the same username / roll number
  return json_build_object('status', 'username_taken');
end $$;

-- Same matching rules as the original in-browser login.
-- Returns {"status":"ok","account":{...}} | {"status":"not_found"} | {"status":"bad_password"}
create or replace function public.student_login(p_identifier text, p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  a public.student_accounts;
  q text := lower(trim(p_identifier));
  r text := norm_roll(p_identifier);
  pw text := lower(trim(coalesce(p_password, '')));
  sfx text;
begin
  if q = '' then return json_build_object('status', 'not_found'); end if;
  select * into a from student_accounts s
  where lower(s.username) = q or lower(s.username) = lower(r)
     or (r <> '' and (s.roll_no = r or norm_roll(s.username) = r))
     or lower(coalesce(s.email, '')) = q or lower(s.full_name) = q
  order by s.created_at limit 1;
  if not found then return json_build_object('status', 'not_found'); end if;

  sfx := lower(right(coalesce(a.roll_no, ''), 4));
  if a.password_hash = crypt(pw, a.password_hash)
     or pw = lower(a.username)
     or (a.roll_no is not null and norm_roll(p_password) = a.roll_no)
     or (sfx <> '' and pw in (sfx, 'jv@' || sfx || '#', 'jv@' || sfx, 'jv' || sfx || '#', 'jv' || sfx))
  then
    return json_build_object('status', 'ok', 'account', student_account_json(a));
  end if;
  return json_build_object('status', 'bad_password');
end $$;

-- Public directory for the admin's "accounts created" counts (no emails, no passwords).
create or replace function public.student_directory()
returns json language sql security definer set search_path = public as $$
  select coalesce(json_agg(json_build_object(
    'id', id, 'username', username, 'fullName', full_name, 'program', program, 'rollNo', roll_no,
    'year', year, 'batchYear', batch_year, 'branch', branch, 'passwordHash', '', 'createdAt', created_at
  )), '[]'::json) from student_accounts
$$;

revoke all on function public.student_register(jsonb) from public;
revoke all on function public.student_login(text, text) from public;
revoke all on function public.student_directory() from public;
grant execute on function public.student_register(jsonb) to anon, authenticated;
grant execute on function public.student_login(text, text) to anon, authenticated;
grant execute on function public.student_directory() to anon, authenticated;
