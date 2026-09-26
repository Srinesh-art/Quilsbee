-- Quantum//World production auth and progress schema
-- Run this once in the Supabase SQL Editor.
-- The browser uses only the publishable key; RLS keeps learner rows private.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Explorer',
  xp integer not null default 420 check (xp >= 0),
  level integer not null default 2 check (level >= 1),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists xp integer;
alter table public.profiles add column if not exists level integer;
alter table public.profiles add column if not exists updated_at timestamptz;

alter table public.profiles enable row level security;

drop policy if exists "Learners can read their own profile" on public.profiles;
create policy "Learners can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Learners can insert their own profile" on public.profiles;
create policy "Learners can insert their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Learners can update their own profile" on public.profiles;
create policy "Learners can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name',
             new.raw_user_meta_data ->> 'full_name',
             split_part(new.email, '@', 1),
             'Explorer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Lesson completion/progress can be persisted independently of XP.
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Learners can read their own lesson progress" on public.lesson_progress;
create policy "Learners can read their own lesson progress"
on public.lesson_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Learners can insert their own lesson progress" on public.lesson_progress;
create policy "Learners can insert their own lesson progress"
on public.lesson_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Learners can update their own lesson progress" on public.lesson_progress;
create policy "Learners can update their own lesson progress"
on public.lesson_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
