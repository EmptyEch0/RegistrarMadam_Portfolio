-- QLearn puzzle leaderboard
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run

create table if not exists public.puzzle_scores (
  id            uuid primary key default gen_random_uuid(),
  puzzle_id     text        not null check (char_length(puzzle_id) between 1 and 100),
  player_name   text        not null check (char_length(btrim(player_name)) between 1 and 30),
  seconds       integer     not null check (seconds between 1 and 86400),
  hints         integer     not null default 0 check (hints >= 0),
  -- Ranking score: solve time plus a 30 second penalty per hint (lower is better)
  total_seconds integer     generated always as (seconds + hints * 30) stored,
  created_at    timestamptz not null default now()
);

create index if not exists puzzle_scores_rank_idx
  on public.puzzle_scores (puzzle_id, total_seconds, created_at);

-- Visitors (anon key) may read the leaderboard and add their own score, but never edit or delete
alter table public.puzzle_scores enable row level security;

drop policy if exists "Anyone can view puzzle scores" on public.puzzle_scores;
create policy "Anyone can view puzzle scores"
  on public.puzzle_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit a puzzle score" on public.puzzle_scores;
create policy "Anyone can submit a puzzle score"
  on public.puzzle_scores for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.puzzle_scores to anon, authenticated;
