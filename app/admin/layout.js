import PortalSidebar from '@/components/portal/PortalSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0d18] flex flex-col">
      <PortalSidebar role="admin" />
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
  )
}
