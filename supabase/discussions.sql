-- ====================================================================
-- DISCUSSION FORUM (name-only posting, every post approved by admin)
-- Run AFTER inquiries.sql (reuses admin_secrets + check_inquiries_key,
-- so the Requests Inbox password also unlocks forum moderation).
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql/new
-- ====================================================================

create table if not exists public.discussion_threads (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 3 and 200),
  body        text not null check (char_length(body) between 1 and 5000),
  category    text not null default 'general'
              check (category in ('general', 'ask-professor', 'quantum-computing', 'data-science',
                                  'machine-learning', 'deep-learning', 'iot-internet-of-things', 'agentic-ai')),
  author_name text not null check (char_length(author_name) between 1 and 80),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_pinned   boolean not null default false,
  is_locked   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.discussion_replies (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.discussion_threads(id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 5000),
  author_name text not null check (char_length(author_name) between 1 and 80),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);

create index if not exists discussion_replies_thread_idx on public.discussion_replies (thread_id, created_at);

alter table public.discussion_threads enable row level security;
alter table public.discussion_replies enable row level security;

-- Public sees only approved content
drop policy if exists "Public reads approved threads" on public.discussion_threads;
create policy "Public reads approved threads"
  on public.discussion_threads for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public reads approved replies" on public.discussion_replies;
create policy "Public reads approved replies"
  on public.discussion_replies for select to anon, authenticated
  using (status = 'approved');

-- Anyone may submit, but only into the review queue
drop policy if exists "Anyone submits threads for review" on public.discussion_threads;
create policy "Anyone submits threads for review"
  on public.discussion_threads for insert to anon, authenticated
  with check (status = 'pending' and not is_pinned and not is_locked);

drop policy if exists "Anyone submits replies for review" on public.discussion_replies;
create policy "Anyone submits replies for review"
  on public.discussion_replies for insert to anon, authenticated
  with check (
    status = 'pending'
    and exists (
      select 1 from public.discussion_threads t
      where t.id = thread_id and t.status = 'approved' and not t.is_locked
    )
  );
-- (no public update/delete policies on purpose)

-- ===== Admin: everything (incl. pending) behind the inbox access key =====
create or replace function public.admin_list_discussions(p_key text)
returns json language plpgsql security definer set search_path = public as $$
begin
  perform check_inquiries_key(p_key);
  return json_build_object(
    'threads', coalesce((select json_agg(t order by t.created_at desc) from discussion_threads t), '[]'::json),
    'replies', coalesce((select json_agg(r order by r.created_at desc) from discussion_replies r), '[]'::json)
  );
end $$;

-- p_kind: 'thread' | 'reply'
-- p_action: approve | reject | delete | pin | unpin | lock | unlock (pin/lock: threads only)
create or replace function public.admin_moderate(p_key text, p_kind text, p_id uuid, p_action text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform check_inquiries_key(p_key);
  if p_kind = 'thread' then
    case p_action
      when 'approve' then update discussion_threads set status = 'approved' where id = p_id;
      when 'reject'  then update discussion_threads set status = 'rejected' where id = p_id;
      when 'delete'  then delete from discussion_threads where id = p_id;
      when 'pin'     then update discussion_threads set is_pinned = true  where id = p_id;
      when 'unpin'   then update discussion_threads set is_pinned = false where id = p_id;
      when 'lock'    then update discussion_threads set is_locked = true  where id = p_id;
      when 'unlock'  then update discussion_threads set is_locked = false where id = p_id;
      else raise exception 'unknown action %', p_action;
    end case;
  elsif p_kind = 'reply' then
    case p_action
      when 'approve' then update discussion_replies set status = 'approved' where id = p_id;
      when 'reject'  then update discussion_replies set status = 'rejected' where id = p_id;
      when 'delete'  then delete from discussion_replies where id = p_id;
      else raise exception 'unknown action %', p_action;
    end case;
  else
    raise exception 'unknown kind %', p_kind;
  end if;
end $$;

revoke all on function public.admin_list_discussions(text) from public;
revoke all on function public.admin_moderate(text, text, uuid, text) from public;
grant execute on function public.admin_list_discussions(text) to anon, authenticated;
grant execute on function public.admin_moderate(text, text, uuid, text) to anon, authenticated;
