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
    <aside className="w-64 min-h-screen bg-navy border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <img src="/logo_dark-nbg.png" alt="InTime" className="h-8" />
        <span className="text-gray-400 text-xs mt-2 block capitalize">{role} Portal</span>
      </div>

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
