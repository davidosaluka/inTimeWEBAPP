# Supabase Project Setup Guide

Follow these steps in the Supabase dashboard to configure the backend for InTime portals.

---

## 1. Create Supabase Project

1. Go to https://supabase.com → **New Project**
2. Choose your organization, name the project, set a database password
3. Wait for the database to provision (~1-2 minutes)
4. In **Project Settings → API**, copy the **Project URL** and **anon public key**
5. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
6. The `.env.local` file is already gitignored — it will not be committed

---

## 2. Create the `profiles` table

Run this SQL in the **SQL Editor**:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('rider', 'vendor', 'admin')),
  full_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
```

---

## 3. Create the `entries` table

```sql
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('rider', 'vendor')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  vendor_id uuid references auth.users(id),
  vendor_note text,
  package_description text not null,
  pickup_location text not null,
  delivery_location text not null,
  expected_delivery_fee text,
  created_at timestamptz default now()
);

alter table public.entries enable row level security;
```

---

## 4. Add RLS Policies

### On `profiles`:

```sql
-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create admin check function (security definer prevents infinite recursion)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Anyone can view vendor profiles (for the assignment dropdown)
create policy "Anyone can view vendor profiles"
  on public.profiles for select
  using (role = 'vendor');
```

### On `entries`:

```sql
-- Riders see their own entries
create policy "Riders view own entries"
  on public.entries for select
  using (auth.uid() = user_id);

-- Vendors see entries assigned to them
create policy "Vendors view assigned entries"
  on public.entries for select
  using (vendor_id = auth.uid());

-- Riders insert their own entries (with assigned vendor_id)
create policy "Riders insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

-- Vendors can approve/reject pending entries assigned to them
create policy "Vendors update assigned pending entries"
  on public.entries for update
  using (vendor_id = auth.uid() and status = 'pending');

-- Admins can update any entry
create policy "Admin update any entry"
  on public.entries for update
  using (public.is_admin());

-- Riders can delete their own pending entries
create policy "Riders delete own pending entries"
  on public.entries for delete
  using (auth.uid() = user_id and status = 'pending');

-- Admins can delete any entry
create policy "Admin delete any entry"
  on public.entries for delete
  using (public.is_admin());

-- Admins can view all entries
create policy "Admins view all entries"
  on public.entries for select
  using (public.is_admin());
```

> Entries cannot be edited after submission — only approved/rejected by vendors or admins.

---

## 5. Auto-create profile on signup (DB trigger)

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 6. Create the admin user (manual, DB only)

Admins cannot self-register. Create them manually:

1. In Supabase Dashboard → **Authentication → Users → Add User**
2. Set their email and a temporary password
3. Copy their UUID from the users list
4. Insert their profile:

```sql
insert into public.profiles (id, email, role, full_name)
values ('paste-uuid-here', 'admin@intime.com', 'admin', 'InTime Admin');
```

---

## 7. Auth Settings (Optional)

- To disable email confirmation for testing:
  **Authentication → Settings → Enable email confirmations** → toggle OFF

- Add allowed redirect URLs (for Netlify deployment):
  **Authentication → URL Configuration**
  ```
  https://your-site-name.netlify.app/**
  ```
