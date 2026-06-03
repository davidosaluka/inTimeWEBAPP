'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Spinner from '@/components/portal/Spinner'

export default function AdminEntries() {
  const supabase = createClient()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rejectNote, setRejectNote] = useState('')
  const [rejectId, setRejectId] = useState(null)
  const [editingPrice, setEditingPrice] = useState(null)
  const [priceValue, setPriceValue] = useState('')

  useEffect(() => {
    fetchEntries()
  }, [roleFilter, statusFilter])

  async function fetchEntries() {
    setLoading(true)
    let query = supabase.from('entries').select('*').order('created_at', { ascending: false })
    if (roleFilter !== 'all') query = query.eq('role', roleFilter)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)

    const { data } = await query
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

  async function handleAction(entryId, status) {
    setActionId(entryId)
    const update = status === 'rejected'
      ? { status, vendor_note: rejectNote }
      : { status, vendor_note: null }

    const { error } = await supabase.from('entries').update(update).eq('id', entryId)
    if (!error) setEntries(prev => prev.filter(e => e.id !== entryId))
    setActionId(null)
    setRejectId(null)
    setRejectNote('')
  }

  async function handleDelete(entryId) {
    if (!confirm('Delete this entry permanently?')) return
    setActionId(entryId)
    const { error } = await supabase.from('entries').delete().eq('id', entryId)
    if (!error) setEntries(prev => prev.filter(e => e.id !== entryId))
    setActionId(null)
  }

  async function handleSavePrice(entryId) {
    setActionId(entryId)
    const { error } = await supabase.from('entries').update({ final_price: priceValue }).eq('id', entryId)
    if (!error) {
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, final_price: priceValue } : e))
    }
    setActionId(null)
    setEditingPrice(null)
    setPriceValue('')
  }

  function startEditPrice(entry) {
    setEditingPrice(entry.id)
    setPriceValue(entry.final_price || '')
  }

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
      <h1 className="text-gray-900 text-2xl font-bold mb-2">All Entries</h1>
      <p className="text-gray-500 text-sm mb-4">{entries.length} entries.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 text-xs">Role:</span>
          {['all', 'rider', 'vendor'].map(f => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors capitalize ${
                roleFilter === f ? 'bg-[#F94C05] text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center ml-4">
          <span className="text-gray-500 text-xs">Status:</span>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors capitalize ${
                statusFilter === f ? 'bg-[#F94C05] text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-8">
          <Spinner size="md" />
          <span className="text-sm">Loading entries...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No entries match the selected filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Order ID</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">#</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Role</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Rider</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Package</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Pickup</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Delivery</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Fee</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Status</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Vendor</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Note</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Final Price</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Date</th>
                <th className="text-gray-600 font-medium px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="text-[#F94C05] px-4 py-4 font-mono text-xs font-bold">{entry.order_id || '—'}</td>
                  <td className="text-gray-500 px-4 py-4 text-xs">{idx + 1}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.role === 'rider' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>{entry.role}</span>
                  </td>
                  <td className="text-gray-900 px-4 py-4">{entry.creatorProfile?.full_name || entry.creatorProfile?.email || 'Unknown'}</td>
                  <td className="text-gray-900 px-4 py-4 font-medium">{entry.package_description}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.pickup_location}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.delivery_location}</td>
                  <td className="text-[#F94C05] px-4 py-4 font-medium">{entry.expected_delivery_fee || '—'}</td>
                  <td className="px-4 py-4">{statusBadge(entry.status)}</td>
                  <td className="text-gray-600 px-4 py-4">{entry.vendorProfile?.full_name || entry.vendorProfile?.email || '—'}</td>
                  <td className="text-gray-500 px-4 py-4 text-xs max-w-[150px] truncate">{entry.vendor_note || '—'}</td>
                  <td className="px-4 py-4">
                    {editingPrice === entry.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="text"
                          value={priceValue}
                          onChange={e => setPriceValue(e.target.value)}
                          className="w-24 bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                          placeholder="₦0"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePrice(entry.id)}
                          disabled={actionId === entry.id}
                          className="text-green-600 hover:text-green-700 text-xs disabled:opacity-50"
                        >
                          {actionId === entry.id ? <Spinner size="xs" /> : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingPrice(null)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditPrice(entry)}
                        className="text-green-600 hover:text-green-700 text-xs font-medium cursor-pointer"
                      >
                        {entry.final_price || '—'}
                      </button>
                    )}
                  </td>
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
                          placeholder="Reason..."
                          rows={2}
                          className="w-40 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAction(entry.id, 'rejected')}
                            disabled={actionId === entry.id || !rejectNote.trim()}
                            className="bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs px-2 py-1 rounded"
                          >
                            {actionId === entry.id ? '...' : 'Confirm'}
                          </button>
                          <button onClick={() => { setRejectId(null); setRejectNote('') }} className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1">Cancel</button>
                        </div>
                      </div>
                    ) : entry.status === 'pending' ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAction(entry.id, 'approved')}
                          disabled={actionId === entry.id}
                          className="bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 text-xs px-2.5 py-1 rounded font-medium"
                        >
                          {actionId === entry.id ? <Spinner size="xs" /> : 'Accept'}
                        </button>
                        <button
                          onClick={() => setRejectId(entry.id)}
                          disabled={actionId === entry.id}
                          className="bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 text-xs px-2.5 py-1 rounded font-medium"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={actionId === entry.id}
                          className="text-gray-500 hover:text-red-600 disabled:opacity-50 text-xs px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={actionId === entry.id}
                        className="text-gray-500 hover:text-red-600 disabled:opacity-50 text-xs font-medium"
                      >
                        {actionId === entry.id ? '...' : 'Delete'}
                      </button>
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
