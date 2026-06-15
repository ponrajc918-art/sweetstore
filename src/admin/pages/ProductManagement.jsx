import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, GripVertical, Pencil, Trash2, Eye, EyeOff, Filter } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ProductForm from '../components/ProductForm'
import ConfirmModal from '../components/ConfirmModal'

export default function ProductManagement({ admin, onLogout, authFetch, toast }) {
  const [products,    setProducts]    = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [filterStatus, setFilterStatus] = useState('all')  // all | enabled | disabled
  const [formOpen,    setFormOpen]    = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget,setDeleteTarget]= useState(null)
  const [deleting,    setDeleting]    = useState(false)
  const [dragIdx,     setDragIdx]     = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/products?admin=true')
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      toast.error('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [authFetch, toast])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Apply search + filter
  useEffect(() => {
    let list = [...products]
    if (filterStatus === 'enabled')  list = list.filter(p => p.enabled)
    if (filterStatus === 'disabled') list = list.filter(p => !p.enabled)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(list)
  }, [products, search, filterStatus])

  // ── Save (create or update) ────────────────────────────────────
  const handleSave = async (payload) => {
    const isEdit = Boolean(editProduct?._id)
    const url    = isEdit ? `/api/products/${editProduct._id}` : '/api/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res  = await authFetch(url, { method, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Save failed')

    toast.success(isEdit ? 'Product updated.' : 'Product created.')
    await fetchProducts()
  }

  // ── Toggle enabled ─────────────────────────────────────────────
  const handleToggle = async (product) => {
    const res  = await authFetch(`/api/products/${product._id}`, {
      method: 'PUT',
      body:   JSON.stringify({ enabled: !product.enabled }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error || 'Toggle failed.'); return }
    toast.success(`${product.name} is now ${!product.enabled ? 'visible' : 'hidden'}.`)
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, enabled: !p.enabled } : p))
  }

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await authFetch(`/api/products/${deleteTarget._id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast.success('Product deleted.')
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  // ── Drag reorder ───────────────────────────────────────────────
  const onDragStart = (idx) => setDragIdx(idx)
  const onDragOver  = (e, idx) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const next = [...products]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    setDragIdx(idx)
    setProducts(next)
  }
  const onDragEnd = async () => {
    setDragIdx(null)
    const order = products.map((p, i) => ({ id: p._id, order: i }))
    try {
      await authFetch('/api/products/reorder', { method: 'PUT', body: JSON.stringify({ order }) })
      toast.success('Order saved.')
    } catch {
      toast.error('Failed to save order.')
    }
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} pageTitle="Products">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:max-w-lg">
            {/* Search */}
            <div className="adm-search flex-1">
              <Search size={16} />
              <input
                className="adm-input"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filter */}
            <select
              className="adm-input adm-select w-32 flex-shrink-0"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="enabled">Live</option>
              <option value="disabled">Hidden</option>
            </select>
          </div>
          <button
            onClick={() => { setEditProduct(null); setFormOpen(true) }}
            className="adm-btn adm-btn-gold flex-shrink-0"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Table card */}
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <span className="adm-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center p-12">
              <Search size={36} className="mx-auto mb-3" style={{ color: 'var(--adm-text-3)' }} />
              <p style={{ color: 'var(--adm-text-2)' }}>
                {search || filterStatus !== 'all' ? 'No products match your filter.' : 'No products yet.'}
              </p>
              {!search && filterStatus === 'all' && (
                <button onClick={() => { setEditProduct(null); setFormOpen(true) }}
                  className="adm-btn adm-btn-gold mt-4">
                  <Plus size={16} /> Add First Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <p className="text-xs px-4 pt-3 pb-1" style={{ color: 'var(--adm-text-3)' }}>
                Drag rows to reorder · {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </p>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>Product</th>
                    <th className="hidden md:table-cell">Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr
                      key={p._id}
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={e => onDragOver(e, idx)}
                      onDragEnd={onDragEnd}
                      style={{ opacity: dragIdx === idx ? 0.5 : 1, cursor: 'default' }}
                    >
                      {/* Drag handle */}
                      <td className="px-3">
                        <GripVertical size={16} className="drag-handle" />
                      </td>

                      {/* Name + image */}
                      <td>
                        <div className="flex items-center gap-3">
                          {p.images?.[0]?.url
                            ? <img src={p.images[0].url} alt={p.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border" style={{ borderColor: 'var(--adm-border)' }} />
                            : <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--adm-surface-2)' }}>
                                <Filter size={14} style={{ color: 'var(--adm-text-3)' }} />
                              </div>
                          }
                          <div>
                            <p className="text-white font-medium text-sm leading-tight">{p.name}</p>
                            {p.badge && (
                              <span className="adm-badge adm-badge-gold" style={{ fontSize: 10, marginTop: 2 }}>{p.badge}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="hidden md:table-cell" style={{ maxWidth: 220 }}>
                        <p className="text-sm truncate" style={{ color: 'var(--adm-text-2)' }}>
                          {p.description || <span style={{ color: 'var(--adm-text-3)' }}>No description</span>}
                        </p>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="text-sm" style={{ color: p.price != null ? 'var(--adm-gold-light)' : 'var(--adm-text-3)' }}>
                          {p.price != null ? `₹${p.price}` : '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <button onClick={() => handleToggle(p)} className="adm-toggle" title={p.enabled ? 'Click to hide' : 'Click to show'}>
                          <input type="checkbox" checked={p.enabled} readOnly />
                          <span className="adm-toggle-track" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditProduct(p); setFormOpen(true) }}
                            className="adm-btn adm-btn-ghost"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            title="Edit product"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleToggle(p)}
                            className="adm-btn adm-btn-ghost"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            title={p.enabled ? 'Hide product' : 'Show product'}
                          >
                            {p.enabled ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="adm-btn adm-btn-danger"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            title="Delete product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product form modal */}
      <ProductForm
        open={formOpen}
        product={editProduct}
        authFetch={authFetch}
        onSave={handleSave}
        onClose={() => { setFormOpen(false); setEditProduct(null) }}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action cannot be undone. The product will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  )
}
