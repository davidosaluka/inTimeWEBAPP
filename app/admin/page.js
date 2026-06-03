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
      <h1 className="text-gray-900 text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview of all activity on InTime.</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {cards.map(card => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-orange-500 transition-colors"
            >
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-gray-900 text-3xl font-bold mt-1">{card.value ?? '—'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
