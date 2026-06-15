import { useState } from 'react'
import { Menu, Clock } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AdminLayout({ children, admin, onLogout, pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="adm-layout">
      {/* Mobile overlay */}
      <div
        className={`adm-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        className={sidebarOpen ? 'open' : ''}
      />

      <div className="adm-main">
        {/* Top header */}
        <header className="adm-header">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/8 transition-colors"
              style={{ color: 'var(--adm-text-2)' }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-white font-semibold text-base">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {admin?.userId && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--adm-surface-2)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg,#E8B840,#C9952A)' }}>
                  {admin.userId.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--adm-text-2)' }}>
                  {admin.userId}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--adm-text-3)' }}>
              <Clock size={13} />
              <span>30m session</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto" style={{ background: 'var(--adm-bg)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
