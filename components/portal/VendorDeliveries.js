'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Spinner from './Spinner'

export default function VendorDeliveries() {
  const supabase = createClient()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [rejectId, setRejectId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  async function fetchDeliveries() {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (data) {
      const userIds = [...new Set(data.map(e => e.user_id))]
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone')
          .in('id', userIds)
        const profileMap = {}
        if (profiles) profiles.forEach(p => { profileMap[p.id] = p })
        setEntries(data.map(e => ({ ...e, riderProfile: profileMap[e.user_id] || null })))
      } else {
        setEntries(data)
      }
    }
    setLoading(false)
  }

  async function handleAction(entryId, status) {
    setError(null)
    setActionId(entryId)
    const update = status === 'rejected'
      ? { status, vendor_note: rejectNote }
      : { status, vendor_note: null }

    const { error: updateError } = await supabase.from('entries').update(update).eq('id', entryId)

    if (updateError) {
      setError(`Failed to ${status} entry: ${updateError.message}`)
      setActionId(null)
      return
    }

    setEntries(prev => prev.filter(e => e.id !== entryId))
    setActionId(null)
    setRejectId(null)
    setRejectNote('')
  }

  return (
    <div>
      <h1 className="text-gray-900 text-2xl font-bold mb-2">Deliveries</h1>
      <p className="text-gray-500 text-sm mb-8">Pending delivery requests assigned to you.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <Spinner size="md" />
          <span className="text-sm">Loading deliveries...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No pending deliveries.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Order ID</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Rider</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Email</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Phone</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Package</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Pickup</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Delivery</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Fee</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Date</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="text-[#F94C05] px-4 py-4 font-mono text-xs font-bold">{entry.order_id}</td>
                  <td className="text-gray-900 px-4 py-4">{entry.riderProfile?.full_name || entry.riderProfile?.email || 'Unknown'}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.riderProfile?.email || '—'}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.riderProfile?.phone || '—'}</td>
                  <td className="text-gray-900 px-4 py-4 font-medium">{entry.package_description}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.pickup_location}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.delivery_location}</td>
                  <td className="text-[#F94C05] px-4 py-4 font-medium">{entry.expected_delivery_fee || '—'}</td>
                  <td className="text-gray-400 px-4 py-4 text-xs whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-4">
                    {rejectId === entry.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)}
                          placeholder="Reason for rejection..."
                          rows={2}
                          className="w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleAction(entry.id, 'rejected')}
                            disabled={actionId === entry.id || !rejectNote.trim()}
                            className="bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            {actionId === entry.id ? <Spinner size="xs" /> : null}
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => { setRejectId(null); setRejectNote('') }}
                            className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAction(entry.id, 'approved')}
                          disabled={actionId === entry.id}
                          className="bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          {actionId === entry.id ? <Spinner size="xs" /> : null}
                          Accept
                        </button>
                        <button
                          onClick={() => setRejectId(entry.id)}
                          disabled={actionId === entry.id}
                          className="bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
