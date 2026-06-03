-- 1. Add approval columns to entries table
alter table public.entries
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

alter table public.entries
  add column if not exists vendor_id uuid references auth.users(id);

alter table public.entries
  add column if not exists vendor_note text;

-- 2. Allow riders to see vendor names (for the dropdown in EntryForm)
create policy "Anyone can view vendor profiles"
  on public.profiles for select
  using (role = 'vendor');

-- 3. Drop old catch-all policies
drop policy if exists "Users view own entries" on public.entries;
drop policy if exists "Users insert own entries" on public.entries;
drop policy if exists "Users delete own entries" on public.entries;

-- 4. New SELECT policies for entries
-- Riders see their own entries
create policy "Riders view own entries"
  on public.entries for select
  using (auth.uid() = user_id);

-- Vendors see entries assigned to them
create policy "Vendors view assigned entries"
  on public.entries for select
  using (vendor_id = auth.uid());

-- 5. INSERT policy — riders insert their own entries
create policy "Riders insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

-- 6. UPDATE policies — vendors on assigned pending, admins on all
drop policy if exists "Vendors update assigned pending entries" on public.entries;
create policy "Vendors update assigned pending entries"
  on public.entries for update
  using (vendor_id = auth.uid() and status = 'pending')
  with check (vendor_id = auth.uid());

drop policy if exists "Admin update any entry" on public.entries;
create policy "Admin update any entry"
  on public.entries for update
  using (public.is_admin())
  with check (public.is_admin());

-- 7. DELETE policies — riders on own pending, admins on all
create policy "Riders delete own pending entries"
  on public.entries for delete
  using (auth.uid() = user_id and status = 'pending');

create policy "Admin delete any entry"
  on public.entries for delete
  using (public.is_admin());
