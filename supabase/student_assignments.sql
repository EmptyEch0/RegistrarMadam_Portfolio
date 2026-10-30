-- ====================================================================
-- SUPABASE STORAGE BUCKET & TABLES FOR STUDENT ASSIGNMENTS & MARKS
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkiqeyhmoipzqawqqrvv/sql
-- ====================================================================

-- 1. CREATE STORAGE BUCKET FOR ASSIGNMENT PDFS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assignments',
  'assignments',
  true,
  1048576, -- 1 MB limit in bytes
  array['application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 1048576,
  allowed_mime_types = array['application/pdf'];

-- 2. STORAGE POLICIES FOR THE 'assignments' BUCKET
-- Allow anyone (students) to upload their assignment PDF
drop policy if exists "Anyone can upload assignment PDFs" on storage.objects;
create policy "Anyone can upload assignment PDFs"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'assignments');

-- Allow anyone (students & faculty) to view/download assignment PDFs
drop policy if exists "Anyone can view assignment PDFs" on storage.objects;
create policy "Anyone can view assignment PDFs"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'assignments');

-- Allow faculty/service role to delete or update submissions
drop policy if exists "Faculty can manage assignment PDFs" on storage.objects;
create policy "Faculty can manage assignment PDFs"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'assignments');

drop policy if exists "Faculty can delete assignment PDFs" on storage.objects;
create policy "Faculty can delete assignment PDFs"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'assignments');


-- 3. ASSIGNMENT SUBMISSIONS TABLE (Cross-device sync for Admin & Students)
create table if not exists public.assignment_submissions (
  id                  text primary key,
  assignment_id       text not null,
  batch_id            text not null,
  roll_no             text not null,
  student_name        text not null,
  student_account_id  text,
  file_name           text not null,
  file_size           bigint not null,
  file_url            text not null,
  submitted_at        timestamptz not null default now(),
  comment             text
);

create index if not exists assignment_submissions_roll_no_idx
  on public.assignment_submissions (roll_no);

create index if not exists assignment_submissions_assign_idx
  on public.assignment_submissions (assignment_id);

alter table public.assignment_submissions enable row level security;

-- Submissions Table Policies
drop policy if exists "Allow public insert on assignment_submissions" on public.assignment_submissions;
create policy "Allow public insert on assignment_submissions"
  on public.assignment_submissions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public select on assignment_submissions" on public.assignment_submissions;
create policy "Allow public select on assignment_submissions"
  on public.assignment_submissions for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public update on assignment_submissions" on public.assignment_submissions;
create policy "Allow public update on assignment_submissions"
  on public.assignment_submissions for update
  to anon, authenticated
  using (true);

grant select, insert, update on public.assignment_submissions to anon, authenticated;


-- 4. STUDENT MARKS TABLE (For Mid-1, Mid-2, and Assignment Marks)
create table if not exists public.student_marks_records (
  id                  text primary key,
  batch_id            text not null,
  roll_no             text not null,
  student_name        text,
  mid_marks           text, -- Mid-1 Marks
  mid2_marks          text, -- Mid-2 Marks
  assignment_marks    text, -- Assignment evaluation
  remarks             text,
  updated_at          timestamptz not null default now()
);

create unique index if not exists student_marks_batch_roll_idx
  on public.student_marks_records (batch_id, roll_no);

alter table public.student_marks_records enable row level security;

drop policy if exists "Allow public select on student_marks" on public.student_marks_records;
create policy "Allow public select on student_marks"
  on public.student_marks_records for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert/update on student_marks" on public.student_marks_records;
create policy "Allow public insert/update on student_marks"
  on public.student_marks_records for all
  to anon, authenticated
  using (true);

grant all on public.student_marks_records to anon, authenticated;

