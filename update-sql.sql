-- 1. Add phone to profiles
alter table public.profiles add column if not exists phone text;

-- 2. Add columns to entries
alter table public.entries add column if not exists order_id text unique;
alter table public.entries add column if not exists final_price text;

-- 3. Update signup trigger to also capture phone
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Auto-generate order_id on insert
create or replace function public.generate_order_id()
returns trigger as $$
begin
  new.order_id := 'ORD-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(md5(random()::text), 1, 4));
  return new;
end;
$$ language plpgsql;

create trigger set_order_id
  before insert on public.entries
  for each row
  when (new.order_id is null)
  execute procedure public.generate_order_id();

-- 5. Fix RLS: allow all authenticated users to view profiles
drop policy if exists "Anyone can view vendor profiles" on public.profiles;
create policy "View any profile"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- 6. Fix vendor update policy: add WITH CHECK so status can change
drop policy if exists "Vendors update assigned pending entries" on public.entries;
create policy "Vendors update assigned pending entries"
  on public.entries for update
  using (vendor_id = auth.uid() and status = 'pending')
  with check (vendor_id = auth.uid());

-- Also fix admin update policy for consistency
drop policy if exists "Admin update any entry" on public.entries;
create policy "Admin update any entry"
  on public.entries for update
  using (public.is_admin())
  with check (public.is_admin());
