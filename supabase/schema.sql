-- Paste into Supabase > SQL Editor and run once.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Apprenant',
  created_at timestamptz not null default now()
);
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('conversation','writing','exam')),
  role text not null check(role in ('user','assistant')),
  content text not null check(char_length(content) <= 10000),
  created_at timestamptz not null default now()
);
create table if not exists public.lesson_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  score integer not null check (score between 0 and 100),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.learning_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('conversation','exam','writing','lesson')),
  minutes integer not null default 0 check(minutes between 0 and 120),
  created_at timestamptz not null default now()
);
create index if not exists idx_chats_user_mode on public.chat_messages(user_id,mode,created_at desc);
create index if not exists idx_attempts_user on public.lesson_attempts(user_id,created_at desc);
create index if not exists idx_events_user on public.learning_events(user_id,created_at desc);
alter table public.profiles enable row level security;
alter table public.chat_messages enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.learning_events enable row level security;
-- Idempotent policies
DROP POLICY IF EXISTS "own profiles read" ON public.profiles;
DROP POLICY IF EXISTS "own profiles insert" ON public.profiles;
DROP POLICY IF EXISTS "own profiles update" ON public.profiles;
DROP POLICY IF EXISTS "own chats read" ON public.chat_messages;
DROP POLICY IF EXISTS "own chats insert" ON public.chat_messages;
DROP POLICY IF EXISTS "own attempts read" ON public.lesson_attempts;
DROP POLICY IF EXISTS "own attempts insert" ON public.lesson_attempts;
DROP POLICY IF EXISTS "own events read" ON public.learning_events;
DROP POLICY IF EXISTS "own events insert" ON public.learning_events;
create policy "own profiles read" on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy "own profiles insert" on public.profiles for insert to authenticated with check ((select auth.uid())=id);
create policy "own profiles update" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "own chats read" on public.chat_messages for select to authenticated using ((select auth.uid())=user_id);
create policy "own chats insert" on public.chat_messages for insert to authenticated with check ((select auth.uid())=user_id);
create policy "own attempts read" on public.lesson_attempts for select to authenticated using ((select auth.uid())=user_id);
create policy "own attempts insert" on public.lesson_attempts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "own events read" on public.learning_events for select to authenticated using ((select auth.uid())=user_id);
create policy "own events insert" on public.learning_events for insert to authenticated with check ((select auth.uid())=user_id);
-- Limit direct table use to authenticated callers through RLS. No service role key required.

-- Create a profile automatically for each newly registered learner.
create or replace function public.create_learner_profile()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles(id, display_name)
  values(new.id, left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1), 'Apprenant'),80))
  on conflict(id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_learner_created on auth.users;
create trigger on_auth_learner_created after insert on auth.users
for each row execute function public.create_learner_profile();
