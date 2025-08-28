-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create subscription_status enum
create type subscription_status as enum ('free', 'trial', 'paid', 'cancelled');

-- Create item_status enum
create type item_status as enum ('pending', 'in_progress', 'completed', 'archived');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  display_name text,
  is_paid boolean default false,
  subscription_status subscription_status default 'free',
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create items table
create table public.items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  status item_status default 'pending',
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.items enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Items policies
create policy "Users can view own items" on public.items
  for select using (auth.uid() = user_id);

create policy "Users can create own items" on public.items
  for insert with check (auth.uid() = user_id);

create policy "Users can update own items" on public.items
  for update using (auth.uid() = user_id);

create policy "Users can delete own items" on public.items
  for delete using (auth.uid() = user_id);

-- Create indexes
create index items_user_id_idx on public.items(user_id);
create index items_status_idx on public.items(status);
create index profiles_email_idx on public.profiles(email);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_items_updated_at before update on public.items
  for each row execute function public.handle_updated_at();

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();