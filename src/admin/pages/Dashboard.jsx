import { useState, useEffect } from 'react'
import { Package, ToggleRight, ToggleLeft, TrendingUp, Zap, ExternalLink } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div>
        <p className="adm-stat-value" style={{ color: 'var(--adm-text)' }}>{value}</p>
        <p className="adm-stat-label">{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--adm-text-3)' }}>{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard({ admin, onLogout, authFetch, toast }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    authFetch('/api/products?admin=true')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  const total    = products.length
  const enabled  = products.filter(p => p.enabled).length
  const disabled = total - enabled
  const withPrice = products.filter(p => p.price != null).length

  const QUICK_ACTIONS = [
    { label: 'Add New Product',    href: '/admin/products',  icon: Package,  desc: 'Create a new product listing' },
    { label: 'Edit Homepage Text', href: '/admin/content',   icon: Zap,      desc: 'Update hero, banners, promo text' },
    { label: 'Upload Images',      href: '/admin/images',    icon: TrendingUp, desc: 'Manage Cloudinary image library' },
    { label: 'View Live Site',     href: '/',                icon: ExternalLink, desc: 'Open the public website', external: true },
  ]

  return (
    <AdminLayout admin={admin} onLogout={onLogout} pageTitle="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome */}
        <div className="adm-card adm-card-gold" style={{ background: 'linear-gradient(135deg, rgba(201,149,42,0.08), rgba(232,184,64,0.04))' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-white text-xl font-bold">Welcome back, {admin?.userId} 👋</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--adm-text-2)' }}>
                JS Palkova Admin Panel — Manage your products, content, and images from here.
              </p>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost text-sm">
              View Live Site ↗
            </a>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-text-3)' }}>
            Product Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Products"    value={loading ? '—' : total}      icon={Package}      color="#C9952A" />
            <StatCard label="Live / Visible"    value={loading ? '—' : enabled}    icon={ToggleRight}  color="#22c55e" sub="Shown to customers" />
            <StatCard label="Hidden / Draft"    value={loading ? '—' : disabled}   icon={ToggleLeft}   color="#ef4444" sub="Not visible" />
            <StatCard label="With Pricing"      value={loading ? '—' : withPrice}  icon={TrendingUp}   color="#3b82f6" sub="Price shown on card" />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-text-3)' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map(a => (
              <a
                key={a.label}
                href={a.href}
                target={a.external ? '_blank' : undefined}
                rel={a.external ? 'noopener noreferrer' : undefined}
                className="adm-card flex flex-col gap-3 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ borderColor: 'var(--adm-border)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--adm-border-gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--adm-border)'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(201,149,42,0.1)', color: 'var(--adm-gold-light)' }}>
                  <a.icon size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{a.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--adm-text-3)' }}>{a.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Product list preview */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-text-3)' }}>
            Products at a Glance
          </h3>
          <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <span className="adm-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-10">
                <Package size={40} className="mx-auto mb-3" style={{ color: 'var(--adm-text-3)' }} />
                <p style={{ color: 'var(--adm-text-2)' }}>No products yet.</p>
                <a href="/admin/products" className="adm-btn adm-btn-gold mt-4 inline-flex">Add First Product</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            {p.images?.[0]?.url && (
                              <img src={p.images[0].url} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-white font-medium text-sm">{p.name}</p>
                              {p.badge && <span className="adm-badge adm-badge-gold text-xs">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--adm-text-2)' }}>
                          {p.price != null ? `₹${p.price}/kg` : <span style={{ color: 'var(--adm-text-3)' }}>—</span>}
                        </td>
                        <td>
                          <span className={`adm-badge ${p.enabled ? 'adm-badge-green' : 'adm-badge-red'}`}>
                            {p.enabled ? 'Live' : 'Hidden'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--adm-text-2)' }}>{p.images?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
