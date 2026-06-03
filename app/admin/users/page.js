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
      <h1 className="text-gray-900 text-2xl font-bold mb-2">All Users</h1>
      <p className="text-gray-500 text-sm mb-8">{users.length} registered users.</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-gray-900 text-sm font-medium">{user.full_name || 'Unnamed'}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                user.role === 'rider' ? 'bg-blue-100 text-blue-700' :
                user.role === 'vendor' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
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
