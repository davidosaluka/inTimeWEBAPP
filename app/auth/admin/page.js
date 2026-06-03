import AuthPage from '@/components/portal/AuthPage'
export default function AdminAuth() {
  return <AuthPage portalRole="admin" showSignup={false} />
}
