import PortalSidebar from '@/components/portal/PortalSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0d18]">
      <PortalSidebar role="admin" />
      <main className="flex-1 p-8 overflow-auto bg-white">
        {children}
      </main>
    </div>
  )
}
