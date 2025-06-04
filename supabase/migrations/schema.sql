-- === TABLES ===

-- Create jobs table
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  description text not null,
  salary text,
  location jsonb not null,
  type text not null,
  apply_url text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Create profiles table
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- === ROW LEVEL SECURITY ===

-- Enable RLS on jobs table
alter table jobs enable row level security;

-- Policy for viewing jobs (public)
create policy "Jobs are viewable by everyone" on jobs
  for select using (true);

-- Policy for inserting jobs (authenticated users only)
create policy "Users can insert their own jobs" on jobs
  for insert with check (auth.uid() = user_id);

-- Policy for updating jobs (only job owners)
create policy "Users can update their own jobs" on jobs
  for update using (auth.uid() = user_id);

-- Policy for deleting jobs (only job owners)
create policy "Users can delete their own jobs" on jobs
  for delete using (auth.uid() = user_id);

-- === FUNCTIONS & TRIGGERS ===

-- Create a trigger to create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- === STORAGE ===

-- Create a storage bucket for public images (optional)
insert into storage.buckets (id, name, public) values ('job_images', 'job_images', true);

-- Storage policy for public read access
create policy "Job images are publicly accessible" on storage.objects
  for select using (bucket_id = 'job_images');

-- Storage policy for authenticated uploads
create policy "Authenticated users can upload job images" on storage.objects
  for insert with check (
    bucket_id = 'job_images' AND 
    auth.role() = 'authenticated'
  ); 