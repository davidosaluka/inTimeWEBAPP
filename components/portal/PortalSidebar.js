'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PortalSidebar({ role }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(true)

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
    <aside className={`${collapsed ? 'w-14' : 'w-64'} min-h-screen bg-navy border-r border-white/10 flex flex-col transition-all duration-200`}>
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10">
        {!collapsed && <img src="/logo_dark-nbg.png" alt="InTime" className="h-8" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {!collapsed && (
        <span className="text-gray-400 text-xs px-4 mt-3 mb-1 block capitalize">{role} Portal</span>
      )}

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-center ${collapsed ? '' : 'justify-start gap-3 px-4'} py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-[#F94C05] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={collapsed ? item.label : undefined}
          >
            {collapsed ? (
              <span className="text-xs font-bold uppercase tracking-wider">{item.label.charAt(0)}</span>
            ) : (
              item.label
            )}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`w-full text-gray-400 hover:text-red-400 text-sm py-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center ${collapsed ? '' : 'justify-start gap-3 px-4'}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          {collapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ) : (
            'Sign Out'
          )}
        </button>
      </div>
    </aside>
  )
}
