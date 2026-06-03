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

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  const portals = [
    { prefix: '/vendor', role: 'vendor', loginPath: '/auth/vendor' },
    { prefix: '/rider', role: 'rider', loginPath: '/auth/rider' },
    { prefix: '/admin', role: 'admin', loginPath: '/auth/admin' },
  ]

  for (const portal of portals) {
    if (path.startsWith(portal.prefix)) {
      if (!user) {
        return NextResponse.redirect(new URL(portal.loginPath, request.url))
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== portal.role) {
        return NextResponse.redirect(new URL(portal.loginPath, request.url))
      }
    }
  }

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
