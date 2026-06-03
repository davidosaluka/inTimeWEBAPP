# InTime Portals — Full Implementation Plan
### Features: `/vendor`, `/rider`, `/admin` portals with Supabase Auth + DB + RBAC

---

## 0. Executive Summary

This plan adds three authenticated portal routes to the existing InTime Next.js (App Router) landing site:

| Route | Users | Purpose |
|---|---|---|
| `/vendor` | Vendors (self-register) | Log delivery requests (no fee field) |
| `/rider` | Riders (self-register) | Log completed deliveries (with fee field) |
| `/admin` | Admins (DB-inserted only) | Dashboard — view all users + all entries |

**Architecture decision:** No backend needed. Supabase is consumed directly from the frontend via the `@supabase/supabase-js` client SDK. This is fully supported, production-safe, and advisable for a Netlify-hosted static/SSR Next.js app. Supabase Row Level Security (RLS) policies enforce data access rules at the database layer, replacing a traditional backend authorization layer.

---

## 1. Prerequisites & Dependencies

### 1.1 Install packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- `@supabase/supabase-js` — core Supabase client
- `@supabase/ssr` — Next.js App Router-compatible auth helpers (handles cookies correctly)

### 1.2 Environment variables

Create a `.env.local` file in the project root (never commit this):

```env
NEXT_PUBLIC_SUPABASE_URL=https://mock-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=mock-anon-key-replace-me-later
```

> **Note for implementor:** These are intentionally mock values. The developer replaces them with real credentials from their Supabase project dashboard under Settings → API. Both variables must be prefixed with `NEXT_PUBLIC_` because they are consumed client-side. The anon key is safe to expose — RLS policies control what data each role can access.

Also add to `.gitignore` (if not already there):
```
.env.local
```

---

## 2. Supabase Project Setup (Manual Steps for Developer)

> These steps are performed once in the Supabase dashboard. The implementor should document them in a `SUPABASE_SETUP.md` file in the repo root.

### 2.1 Create Supabase project
- Go to https://supabase.com → New Project
- Note the **Project URL** and **anon public key** → paste into `.env.local`

### 2.2 Create the `profiles` table

This table stores each user's role and mirrors `auth.users`.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('rider', 'vendor', 'admin')),
  full_name text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
```

### 2.3 Create the `entries` table

Single table for both rider and vendor log entries.

```sql
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('rider', 'vendor')),
  package_description text not null,
  pickup_location text not null,
  delivery_location text not null,
  expected_delivery_fee text,  -- nullable; only riders fill this
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.entries enable row level security;
```

### 2.4 Row Level Security (RLS) Policies

#### On `profiles`:

```sql
-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
```

#### On `entries`:

```sql
-- Users can view their own entries only
create policy "Users view own entries"
  on public.entries for select
  using (auth.uid() = user_id);

-- Users can insert their own entries
create policy "Users insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

-- Users can delete their own entries
create policy "Users delete own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- Admins can view all entries
create policy "Admins view all entries"
  on public.entries for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
```

> **No update policy is created** — this enforces the "cannot edit entries" requirement at the DB layer.

### 2.5 Auto-create profile on signup (DB trigger)

This trigger fires whenever a new user signs up and automatically inserts a row into `profiles` using the role they passed during registration.

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

### 2.6 Create the admin user (manual, DB only)

Admins are never self-registered. The developer creates them manually:

1. In Supabase Dashboard → Authentication → Users → "Invite user" (or use the SQL editor):

```sql
-- Step 1: Create user via Supabase Auth dashboard (Authentication → Add user)
-- Set their email and a temporary password.
-- Copy their UUID from the users list.

-- Step 2: Insert their profile with admin role
insert into public.profiles (id, email, role, full_name)
values ('paste-uuid-here', 'admin@intime.com', 'admin', 'InTime Admin');
```

---

## 3. File & Folder Structure

The implementor must create the following new files and folders. Existing files are **not modified** except where explicitly noted.

```
app/
├── vendor/
│   ├── layout.js          ← portal shell (sidebar + auth guard)
│   ├── page.js            ← redirects to /vendor/log-entry
│   ├── log-entry/
│   │   └── page.js        ← vendor log entry form
│   └── history/
│       └── page.js        ← vendor history table
│
├── rider/
│   ├── layout.js          ← portal shell (sidebar + auth guard)
│   ├── page.js            ← redirects to /rider/log-entry
│   ├── log-entry/
│   │   └── page.js        ← rider log entry form (includes fee field)
│   └── history/
│       └── page.js        ← rider history table
│
├── admin/
│   ├── layout.js          ← admin shell (auth guard, admin-only)
│   ├── page.js            ← admin dashboard overview
│   ├── users/
│   │   └── page.js        ← all users list
│   └── entries/
│       └── page.js        ← all entries list
│
└── auth/
    ├── vendor/
    │   └── page.js        ← vendor login/signup page
    ├── rider/
    │   └── page.js        ← rider login/signup page
    └── admin/
        └── page.js        ← admin login page (no signup link)

lib/
└── supabase/
    ├── client.js          ← browser-side Supabase client (singleton)
    └── middleware.js       ← session refresh helper

components/portal/
    ├── PortalSidebar.js   ← shared sidebar (nav links + logout)
    ├── PortalHeader.js    ← top bar with user info
    ├── EntryForm.js       ← shared form (prop: showFeeField)
    └── HistoryTable.js    ← shared history table with delete

middleware.js               ← Next.js root middleware (route protection)
```

---

## 4. Implementation — File by File

### 4.1 `lib/supabase/client.js`

Browser-side singleton client. Used in all client components.

```js
'use client'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

---

### 4.2 `middleware.js` (root of project, next to `package.json`)

Intercepts all requests. Refreshes Supabase session cookies and enforces route protection:

- `/vendor/*` → must be logged in with role `vendor`
- `/rider/*` → must be logged in with role `rider`
- `/admin/*` → must be logged in with role `admin`
- If unauthenticated or wrong role → redirect to the correct `/auth/{portal}` login page

```js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session — required for @supabase/ssr
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Define protected portal prefixes and their required roles
  const portals = [
    { prefix: '/vendor', role: 'vendor', loginPath: '/auth/vendor' },
    { prefix: '/rider', role: 'rider', loginPath: '/auth/rider' },
    { prefix: '/admin', role: 'admin', loginPath: '/auth/admin' },
  ]

  for (const portal of portals) {
    if (path.startsWith(portal.prefix)) {
      // Not logged in → redirect to portal login
      if (!user) {
        return NextResponse.redirect(new URL(portal.loginPath, request.url))
      }

      // Fetch role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Wrong role → redirect to their own portal or login
      if (!profile || profile.role !== portal.role) {
        return NextResponse.redirect(new URL(portal.loginPath, request.url))
      }
    }
  }

  // If logged-in user tries to access an auth page, redirect to their portal
  if (path.startsWith('/auth/') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/vendor/:path*', '/rider/:path*', '/admin/:path*', '/auth/:path*'],
}
```

---

### 4.3 Auth Pages

#### `app/auth/vendor/page.js` and `app/auth/rider/page.js`

Both follow the same pattern. Create a single reusable `AuthPage` component and render it with a `portalRole` prop.

**`components/portal/AuthPage.js`** — the actual implementation:

```jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// portalRole: 'vendor' | 'rider' | 'admin'
// showSignup: boolean (false for admin)
export default function AuthPage({ portalRole, showSignup = true }) {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Verify role matches portal
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== portalRole) {
      await supabase.auth.signOut()
      setError(`This account is not registered as a ${portalRole}. Please use the correct portal.`)
      setLoading(false)
      return
    }

    router.push(`/${portalRole}/log-entry`)
    router.refresh()
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: portalRole,
          full_name: fullName,
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccessMsg('Account created! Check your email to confirm, then log in.')
      setMode('login')
    }
    setLoading(false)
  }

  const portalLabel = portalRole.charAt(0).toUpperCase() + portalRole.slice(1)

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo_light.png" alt="InTime" className="h-10 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">
            {portalLabel} Portal
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-4">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-white text-sm font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <label className="text-white text-sm font-medium block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-white text-sm font-medium block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F94C05] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {showSignup && (
            <p className="text-gray-400 text-sm text-center mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
                className="text-[#F94C05] hover:underline font-medium"
              >
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

**`app/auth/vendor/page.js`:**
```jsx
import AuthPage from '@/components/portal/AuthPage'
export default function VendorAuth() {
  return <AuthPage portalRole="vendor" showSignup={true} />
}
```

**`app/auth/rider/page.js`:**
```jsx
import AuthPage from '@/components/portal/AuthPage'
export default function RiderAuth() {
  return <AuthPage portalRole="rider" showSignup={true} />
}
```

**`app/auth/admin/page.js`:**
```jsx
import AuthPage from '@/components/portal/AuthPage'
export default function AdminAuth() {
  return <AuthPage portalRole="admin" showSignup={false} />
}
```

> **Note:** `showSignup={false}` hides the "Create one" link on the admin auth page entirely. No self-registration path exists for admins.

---

### 4.4 Portal Layout (Shared Shell)

**`components/portal/PortalSidebar.js`:**

```jsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PortalSidebar({ role }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = role === 'admin'
    ? [
        { label: 'Dashboard', href: '/admin' },
        { label: 'All Users', href: '/admin/users' },
        { label: 'All Entries', href: '/admin/entries' },
      ]
    : [
        { label: 'Log Entry', href: `/${role}/log-entry` },
        { label: 'History', href: `/${role}/history` },
      ]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(`/auth/${role}`)
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-navy border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <img src="/logo_light.png" alt="InTime" className="h-8" />
        <span className="text-gray-400 text-xs mt-2 block capitalize">{role} Portal</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-[#F94C05] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full text-left text-gray-400 hover:text-red-400 text-sm px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
```

---

### 4.5 Portal Layouts

**`app/vendor/layout.js`:**

```jsx
import PortalSidebar from '@/components/portal/PortalSidebar'

export default function VendorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0d18]">
      <PortalSidebar role="vendor" />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

**`app/rider/layout.js`:** — identical, with `role="rider"`

**`app/admin/layout.js`:** — identical, with `role="admin"`

---

### 4.6 Portal Root Pages (Redirects)

**`app/vendor/page.js`:**
```jsx
import { redirect } from 'next/navigation'
export default function VendorRoot() {
  redirect('/vendor/log-entry')
}
```

**`app/rider/page.js`:** — same, redirect to `/rider/log-entry`

**`app/admin/page.js`:** — admin dashboard (see Section 4.9)

---

### 4.7 Shared EntryForm Component

**`components/portal/EntryForm.js`:**

```jsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// showFeeField: boolean — true for riders, false for vendors
export default function EntryForm({ showFeeField, userRole }) {
  const supabase = createClient()

  const [packageDescription, setPackageDescription] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [deliveryFee, setDeliveryFee] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Preset fee ranges for riders
  const feeRanges = [
    '₦500 – ₦1,000',
    '₦1,000 – ₦2,000',
    '₦2,000 – ₦3,500',
    '₦3,500 – ₦5,000',
    '₦5,000 – ₦10,000',
    '₦10,000+',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()

    const entry = {
      user_id: user.id,
      role: userRole,
      package_description: packageDescription,
      pickup_location: pickupLocation,
      delivery_location: deliveryLocation,
      expected_delivery_fee: showFeeField ? deliveryFee : null,
    }

    const { error } = await supabase.from('entries').insert(entry)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setPackageDescription('')
      setPickupLocation('')
      setDeliveryLocation('')
      setDeliveryFee('')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-white text-2xl font-bold mb-2">Log Entry</h1>
      <p className="text-gray-400 text-sm mb-8">
        {userRole === 'rider'
          ? 'Record the details of a completed delivery.'
          : 'Submit a new delivery request.'}
      </p>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-6">
          Entry saved successfully! View it in your{' '}
          <a href={`/${userRole}/history`} className="underline">History</a>.
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-white text-sm font-medium block mb-1">Package Description</label>
          <textarea
            required
            value={packageDescription}
            onChange={e => setPackageDescription(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            placeholder="Describe the package..."
          />
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-1">Pickup Location</label>
          <input
            type="text"
            required
            value={pickupLocation}
            onChange={e => setPickupLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="e.g. 12 Broad Street, Lagos Island"
          />
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-1">Delivery Location</label>
          <input
            type="text"
            required
            value={deliveryLocation}
            onChange={e => setDeliveryLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="e.g. 5 Allen Avenue, Ikeja"
          />
        </div>

        {showFeeField && (
          <div>
            <label className="text-white text-sm font-medium block mb-1">Expected Delivery Fee</label>
            <select
              required
              value={deliveryFee}
              onChange={e => setDeliveryFee(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
            >
              <option value="" disabled className="bg-navy">Select a fee range</option>
              {feeRanges.map(range => (
                <option key={range} value={range} className="bg-navy">{range}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#F94C05] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  )
}
```

---

### 4.8 Shared HistoryTable Component

**`components/portal/HistoryTable.js`:**

```jsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HistoryTable({ showFeeColumn }) {
  const supabase = createClient()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setEntries(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) return
    setDeletingId(id)
    await supabase.from('entries').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeletingId(null)
  }

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading your entries...</p>
  }

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-2">History</h1>
      <p className="text-gray-400 text-sm mb-8">Your past log entries.</p>

      {entries.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-gray-400">No entries yet.</p>
          <a
            href="log-entry"
            className="text-[#F94C05] text-sm mt-2 inline-block hover:underline"
          >
            Log your first entry →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1 space-y-1">
                <p className="text-white font-medium text-sm">{entry.package_description}</p>
                <p className="text-gray-400 text-xs">
                  <span className="text-gray-500">From:</span> {entry.pickup_location}
                </p>
                <p className="text-gray-400 text-xs">
                  <span className="text-gray-500">To:</span> {entry.delivery_location}
                </p>
                {showFeeColumn && entry.expected_delivery_fee && (
                  <p className="text-[#F94C05] text-xs font-medium">
                    Fee: {entry.expected_delivery_fee}
                  </p>
                )}
                <p className="text-gray-600 text-xs">
                  {new Date(entry.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
                className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50 shrink-0 mt-2 sm:mt-0"
              >
                {deletingId === entry.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### 4.9 Portal Pages

**`app/vendor/log-entry/page.js`:**
```jsx
import EntryForm from '@/components/portal/EntryForm'
export default function VendorLogEntry() {
  return <EntryForm showFeeField={false} userRole="vendor" />
}
```

**`app/vendor/history/page.js`:**
```jsx
import HistoryTable from '@/components/portal/HistoryTable'
export default function VendorHistory() {
  return <HistoryTable showFeeColumn={false} />
}
```

**`app/rider/log-entry/page.js`:**
```jsx
import EntryForm from '@/components/portal/EntryForm'
export default function RiderLogEntry() {
  return <EntryForm showFeeField={true} userRole="rider" />
}
```

**`app/rider/history/page.js`:**
```jsx
import HistoryTable from '@/components/portal/HistoryTable'
export default function RiderHistory() {
  return <HistoryTable showFeeColumn={true} />
}
```

---

### 4.10 Admin Portal Pages

**`app/admin/page.js`** — Dashboard overview:

```jsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({ totalUsers: 0, totalRiders: 0, totalVendors: 0, totalEntries: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [{ count: totalUsers }, { count: totalEntries }, { count: totalRiders }, { count: totalVendors }] =
        await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('entries').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'rider'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'vendor'),
        ])
      setStats({ totalUsers, totalEntries, totalRiders, totalVendors })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, href: '/admin/users' },
    { label: 'Riders', value: stats.totalRiders, href: '/admin/users' },
    { label: 'Vendors', value: stats.totalVendors, href: '/admin/users' },
    { label: 'Total Entries', value: stats.totalEntries, href: '/admin/entries' },
  ]

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Overview of all activity on InTime.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {cards.map(card => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-colors"
            >
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-white text-3xl font-bold mt-1">{card.value ?? '—'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

**`app/admin/users/page.js`:**

```jsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminUsers() {
  const supabase = createClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false) })
  }, [])

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-2">All Users</h1>
      <p className="text-gray-400 text-sm mb-8">{users.length} registered users.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{user.full_name || 'Unnamed'}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                user.role === 'rider' ? 'bg-blue-500/20 text-blue-400' :
                user.role === 'vendor' ? 'bg-green-500/20 text-green-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**`app/admin/entries/page.js`:**

```jsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminEntries() {
  const supabase = createClient()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'rider' | 'vendor'

  useEffect(() => {
    let query = supabase.from('entries').select('*, profiles(email, full_name, role)').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('role', filter)
    query.then(({ data }) => { setEntries(data || []); setLoading(false) })
  }, [filter])

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-2">All Entries</h1>
      <div className="flex gap-2 mb-6">
        {['all', 'rider', 'vendor'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-4 py-2 rounded-full transition-colors capitalize ${
              filter === f ? 'bg-[#F94C05] text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-white text-sm font-medium">{entry.package_description}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-3 shrink-0 ${
                  entry.role === 'rider' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                }`}>{entry.role}</span>
              </div>
              <p className="text-gray-400 text-xs">From: {entry.pickup_location}</p>
              <p className="text-gray-400 text-xs">To: {entry.delivery_location}</p>
              {entry.expected_delivery_fee && (
                <p className="text-[#F94C05] text-xs mt-1">Fee: {entry.expected_delivery_fee}</p>
              )}
              <p className="text-gray-600 text-xs mt-2">
                By: {entry.profiles?.full_name || entry.profiles?.email} ·{' '}
                {new Date(entry.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

> **Note for the admin entries query:** The `entries` table join with `profiles` requires an additional RLS policy to allow admins to read profiles during joined queries, or the join should be done server-side. For simplicity, the implementor should ensure the admin's RLS policy on `profiles` is in place as defined in Section 2.4.

---

## 5. Tailwind Config Update

The existing `tailwind.config.js` must have its `content` array updated to include the new paths:

```js
// tailwind.config.js
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}', // this likely already covers it
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
],
```

No new colors need to be added — all portal UI uses the existing `navy` (`#0E1221`) and `brand-orange` (`#F94C05`) colors already defined in the config.

---

## 6. Netlify Deployment Notes

Since the app is deployed on Netlify:

1. **Add environment variables** in Netlify dashboard → Site settings → Environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Next.js middleware** (used for auth route protection) requires the **Edge Runtime**. Ensure `next.config.js` does not disable edge features. No special Netlify plugin is needed beyond the standard `@netlify/plugin-nextjs` (if not already installed, add it):

```bash
npm install -D @netlify/plugin-nextjs
```

And in `netlify.toml` (create if it doesn't exist):
```toml
[[plugins]]
package = "@netlify/plugin-nextjs"
```

3. **Supabase Auth redirect URLs:** In Supabase dashboard → Authentication → URL Configuration, add your Netlify domain to the allowed redirect URLs:
   ```
   https://your-site-name.netlify.app/**
   ```

---

## 7. RBAC Summary

| Action | Rider | Vendor | Admin |
|---|---|---|---|
| Access `/rider/*` | ✅ | ❌ | ❌ |
| Access `/vendor/*` | ❌ | ✅ | ❌ |
| Access `/admin/*` | ❌ | ❌ | ✅ |
| Insert own entries | ✅ | ✅ | ❌ |
| View own entries | ✅ | ✅ | ❌ |
| Delete own entries | ✅ | ✅ | ❌ |
| Edit any entry | ❌ | ❌ | ❌ |
| View all entries | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Self-register | ✅ | ✅ | ❌ |

RBAC is enforced at **three layers**:
1. **Next.js middleware** — redirects wrong roles before any page renders
2. **Supabase RLS policies** — database rejects unauthorized queries even if middleware is bypassed
3. **UI** — portal layouts only render nav items appropriate to the user's role

---

## 8. Implementation Order (for the executing LLM)

Follow this exact order to avoid dependency errors:

1. Install packages (`@supabase/supabase-js`, `@supabase/ssr`, `@netlify/plugin-nextjs`)
2. Create `.env.local` with mock Supabase credentials
3. Create `lib/supabase/client.js`
4. Create `middleware.js` at project root
5. Create `components/portal/AuthPage.js`
6. Create `app/auth/vendor/page.js`, `app/auth/rider/page.js`, `app/auth/admin/page.js`
7. Create `components/portal/PortalSidebar.js`
8. Create `app/vendor/layout.js`, `app/rider/layout.js`, `app/admin/layout.js`
9. Create `app/vendor/page.js`, `app/rider/page.js` (redirects)
10. Create `components/portal/EntryForm.js`
11. Create `components/portal/HistoryTable.js`
12. Create all log-entry and history pages for vendor and rider
13. Create all admin pages (`page.js`, `users/page.js`, `entries/page.js`)
14. Update `tailwind.config.js` content paths if needed
15. Create/update `netlify.toml`
16. Run `npm run build` and verify no errors before deploying

---

## 9. Known Limitations & Future Improvements

- **Email confirmation:** Supabase requires email confirmation by default. This can be disabled in Supabase dashboard → Authentication → Settings → "Enable email confirmations" (toggle off for easier testing).
- **No pagination:** The history and admin tables load all entries at once. Add pagination when entry volume grows.
- **No search/filter on history:** Could be added to `HistoryTable` as a future enhancement.
- **Admin cannot delete users:** Admin portal is read-only. User deletion can be done directly in Supabase dashboard for now.
- **Mobile sidebar:** The sidebar layout described here is desktop-first. A hamburger toggle for mobile can be added to `PortalSidebar` as a follow-up.
