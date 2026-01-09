-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text check (role in ('influencer', 'brand', 'admin')),
  avatar_url text,
  bio text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policy: Public can view confirmed profiles (optional, maybe restrict to authenticated)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Policy: Users can update own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for campaigns
create table campaigns (
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

-- RLS for campaigns
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

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
