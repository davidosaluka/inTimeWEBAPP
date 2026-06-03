'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Spinner from './Spinner'

export default function AuthPage({ portalRole, showSignup = true }) {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
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

    setLoading(false)
    router.push(portalRole === 'vendor' ? '/vendor/deliveries' : `/${portalRole}/log-entry`)
    router.refresh()
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: portalRole,
          full_name: fullName,
          phone,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data?.session) {
      setLoading(false)
      await supabase.auth.getUser()
      router.push(portalRole === 'vendor' ? '/vendor/deliveries' : `/${portalRole}/log-entry`)
      router.refresh()
    } else {
      setSuccessMsg('Account created! Check your email to confirm, then log in.')
      setMode('login')
      setLoading(false)
    }
  }

  const portalLabel = portalRole.charAt(0).toUpperCase() + portalRole.slice(1)

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo_dark-nbg.png" alt="InTime" className="h-10 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">
            {portalLabel} Portal
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

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
            {mode === 'signup' && (
              <div>
                <label className="text-white text-sm font-medium block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="e.g. 08031234567"
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
              className="w-full bg-[#F94C05] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Please wait...
                </>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
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
