-- ============================================================================
-- NETFLUENZ 2.0 — SUPABASE SCHEMA
-- With user approval flow and 72-hour recycle bin
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text check (role in ('influencer', 'brand', 'admin')),
  avatar_url text,
  bio text,
  is_approved boolean default false,
  rejected_at timestamp with time zone default null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comment: rejected_at is used for the 72-hour recycle bin.
-- When an admin rejects a user, rejected_at is set to the current timestamp.
-- After 72 hours, the user is automatically deleted by the cleanup function.

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Profiles
-- ============================================================================

alter table profiles enable row level security;

-- Anyone can view approved profiles
create policy "Approved profiles are viewable by everyone"
  on profiles for select
  using ( is_approved = true and rejected_at is null );

-- Admins can view all profiles (including unapproved)
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================

create table if not exists campaigns (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  budget_min numeric,
  budget_max numeric,
  status text check (status in ('draft', 'active', 'completed', 'cancelled')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) — Campaigns
-- ============================================================================

alter table campaigns enable row level security;

create policy "Campaigns are viewable by everyone"
  on campaigns for select
  using ( true );

create policy "Brands can insert campaigns"
  on campaigns for insert
  with check ( auth.uid() = brand_id );

create policy "Brands can update their own campaigns"
  on campaigns for update
  using ( auth.uid() = brand_id );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, is_approved)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    false  -- All new users start unapproved
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- RECYCLE BIN — 72-HOUR AUTO-DELETE
-- ============================================================================

-- Function to clean up rejected users older than 72 hours
create or replace function public.cleanup_rejected_users()
returns void as $$
begin
  -- Delete auth users whose profiles have been rejected for over 72 hours
  -- The cascade on profiles will handle profile deletion
  delete from auth.users
  where id in (
    select id from public.profiles
    where rejected_at is not null
    and rejected_at < now() - interval '72 hours'
  );
end;
$$ language plpgsql security definer;

-- NOTE: Schedule this function to run periodically using:
-- Supabase Dashboard > Database > Extensions > pg_cron
-- Example cron job (runs every hour):
--   select cron.schedule('cleanup-rejected-users', '0 * * * *', 'select public.cleanup_rejected_users()');
