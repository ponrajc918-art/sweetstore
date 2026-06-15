import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, FileText, Image, Settings, LogOut, X, Shield } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/admin/dashboard'  },
  { label: 'Products',    icon: Package,          path: '/admin/products'   },
  { label: 'Content',     icon: FileText,          path: '/admin/content'    },
  { label: 'Images',      icon: Image,             path: '/admin/images'     },
]

export default function Sidebar({ onClose, onLogout }) {
  const { pathname } = useLocation()
  const navigate     = useNavigate()

  const go = (path) => {
    navigate(path)
    onClose?.()
  }

  return (
    <aside className="adm-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'var(--adm-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#E8B840,#C9952A)' }}>
            <Shield size={16} className="text-black" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">JS Palkova</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--adm-text-3)' }}>Admin Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/8 transition-colors"
          style={{ color: 'var(--adm-text-2)' }}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin navigation">
        <p className="px-5 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--adm-text-3)' }}>
          Management
        </p>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => go(path)}
            className={`adm-nav-item ${pathname === path ? 'active' : ''}`}
            aria-current={pathname === path ? 'page' : undefined}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--adm-border)' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-btn adm-btn-ghost w-full mb-2 text-xs"
          style={{ justifyContent: 'flex-start' }}
        >
          View Website ↗
        </a>
        <button
          onClick={onLogout}
          className="adm-btn adm-btn-ghost w-full text-red-400 hover:text-red-300"
          style={{ justifyContent: 'flex-start', borderColor: 'rgba(239,68,68,0.2)' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
