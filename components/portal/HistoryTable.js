'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Spinner from './Spinner'

export default function HistoryTable({ showFeeColumn, userRole = 'rider' }) {
  const supabase = createClient()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })

    let result = data || []

    if (result.length > 0) {
      const userIds = [...new Set(result.map(e => e.user_id))]
      const vendorIds = [...new Set(result.filter(e => e.vendor_id).map(e => e.vendor_id))]
      const allIds = [...new Set([...userIds, ...vendorIds])]

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('id', allIds)

      const profileMap = {}
      if (profiles) profiles.forEach(p => { profileMap[p.id] = p })

      result = result.map(e => ({
        ...e,
        creatorProfile: profileMap[e.user_id] || null,
        vendorProfile: profileMap[e.vendor_id] || null,
      }))
    }

    setEntries(result)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) return
    setDeletingId(id)
    await supabase.from('entries').delete().eq('id', id)
    setEntries(prev => prev.filter(e => e.id !== id))
    setDeletingId(null)
  }

  const columns = ['Order ID', ...(userRole === 'admin'
    ? ['Rider', 'Package', 'Pickup', 'Delivery', 'Fee', 'Status', 'Vendor', 'Vendor Note', 'Final Price', 'Date', 'Actions']
    : userRole === 'vendor'
    ? ['Rider', 'Package', 'Pickup', 'Delivery', 'Fee', 'Status', 'Note', 'Final Price', 'Date']
    : showFeeColumn
    ? ['Package', 'Pickup', 'Delivery', 'Fee', 'Status', 'Vendor', 'Vendor Note', 'Final Price', 'Date', 'Actions']
    : ['Package', 'Pickup', 'Delivery', 'Status', 'Vendor', 'Vendor Note', 'Final Price', 'Date', 'Actions']
  )]

  function statusBadge(status) {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status] || styles.pending}`}>
        {status}
      </span>
    )
  }

  return (
    <div>
      <h1 className="text-gray-900 text-2xl font-bold mb-2">History</h1>
      <p className="text-gray-500 text-sm mb-8">Your past log entries.</p>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <Spinner size="md" />
          <span className="text-sm">Loading your entries...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No entries yet.</p>
          {userRole !== 'vendor' && (
            <a
              href={userRole === 'admin' ? '/admin/entries' : 'log-entry'}
              className="text-[#F94C05] text-sm mt-2 inline-block hover:underline"
            >
              Log your first entry →
            </a>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map(col => (
                  <th key={col} className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="text-[#F94C05] px-4 py-4 font-mono text-xs font-bold">{entry.order_id || '—'}</td>

                  {(userRole === 'admin' || userRole === 'vendor') && (
                    <td className="text-gray-900 px-4 py-4">
                      {entry.creatorProfile?.full_name || entry.creatorProfile?.email || 'Unknown'}
                    </td>
                  )}

                  <td className="text-gray-900 px-4 py-4 font-medium">{entry.package_description}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.pickup_location}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.delivery_location}</td>

                  {(showFeeColumn || userRole === 'admin' || userRole === 'vendor') && (
                    <td className="text-[#F94C05] px-4 py-4 font-medium">
                      {entry.expected_delivery_fee || '—'}
                    </td>
                  )}

                  <td className="px-4 py-4">{statusBadge(entry.status)}</td>

                  {(userRole === 'rider' || userRole === 'admin') && (
                    <td className="text-gray-600 px-4 py-4">
                      {entry.vendorProfile?.full_name || entry.vendorProfile?.email || '—'}
                    </td>
                  )}

                  {userRole !== 'vendor' && (
                    <td className="text-gray-500 px-4 py-4 text-xs max-w-[200px] truncate">
                      {entry.vendor_note || '—'}
                    </td>
                  )}

                  {userRole === 'vendor' && (
                    <td className="text-gray-500 px-4 py-4 text-xs max-w-[200px] truncate">
                      {entry.vendor_note || '—'}
                    </td>
                  )}

                  <td className="text-green-600 px-4 py-4 font-medium">
                    {entry.final_price || '—'}
                  </td>

                  <td className="text-gray-400 px-4 py-4 text-xs whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>

                  {(userRole === 'rider' || userRole === 'admin') && (
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id || (userRole === 'rider' && entry.status !== 'pending')}
                        className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {deletingId === entry.id ? (
                          <><Spinner size="xs" /> Deleting...</>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
