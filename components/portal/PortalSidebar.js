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
    : role === 'vendor'
    ? [
        { label: 'Deliveries', href: '/vendor/deliveries' },
        { label: 'History', href: '/vendor/history' },
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
    <nav className="sticky top-0 z-50 bg-navy/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between h-14 px-6">
        <div className="flex items-center gap-3">
          <img src="/logo_dark-nbg.png" alt="InTime" className="h-7" />
          <span className="text-gray-400 text-xs capitalize hidden sm:block">{role} Portal</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-[#F94C05] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </nav>
  )
}
