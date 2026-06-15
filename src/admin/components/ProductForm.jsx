import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import ImageUploader from './ImageUploader'

const BADGE_OPTIONS = [
  { label: 'Classic',    color: 'bg-blue-50 text-blue-700'   },
  { label: 'Premium',    color: 'bg-gold-200 text-gold-700'  },
  { label: 'Bestseller', color: 'bg-green-50 text-green-700' },
  { label: 'Special',    color: 'bg-rose-50 text-rose-700'   },
  { label: 'Popular',    color: 'bg-purple-50 text-purple-700'},
  { label: 'New',        color: 'bg-sky-50 text-sky-700'     },
  { label: 'Sale',       color: 'bg-orange-50 text-orange-700'},
]

const EMPTY = {
  name: '', description: '', details: '', price: '', badge: 'Classic',
  badgeColor: 'bg-blue-50 text-blue-700', enabled: true, images: [],
}

export default function ProductForm({ open, product, authFetch, onSave, onClose }) {
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (open) {
      setForm(product ? { ...EMPTY, ...product, price: product.price ?? '' } : EMPTY)
      setErrors({})
    }
  }, [open, product])

  if (!open) return null

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setBadge = (b) => setForm(f => ({ ...f, badge: b.label, badgeColor: b.color }))

  const handleImageUploaded = (result) => {
    setForm(f => ({
      ...f,
      images: [...(f.images || []), { url: result.url, publicId: result.publicId }],
    }))
  }

  const removeImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const validate = () => {
    const e = {}
    if (!form.name?.trim())        e.name = 'Product name is required.'
    if (form.name?.length > 100)   e.name = 'Name must not exceed 100 characters.'
    if (form.price !== '' && isNaN(parseFloat(form.price))) e.price = 'Enter a valid price or leave blank.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: form.price !== '' ? parseFloat(form.price) : null,
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      setErrors({ global: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="adm-overlay" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
      <div className="adm-modal" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--adm-border)' }}>
          <h2 id="product-form-title" className="text-white font-semibold text-lg">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 transition-colors" style={{ color: 'var(--adm-text-2)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {errors.global && (
            <div className="adm-toast error p-4 rounded-xl">{errors.global}</div>
          )}

          {/* Name */}
          <div>
            <label className="adm-label">Product Name <span style={{ color: 'var(--adm-gold)' }}>*</span></label>
            <input className={`adm-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={set('name')} placeholder="e.g. Milk Palkova" maxLength={100} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="adm-label">Short Description</label>
            <textarea className="adm-input adm-textarea" value={form.description} onChange={set('description')} placeholder="Brief product description shown on card…" maxLength={500} rows={3} />
          </div>

          {/* Details */}
          <div>
            <label className="adm-label">Full Details</label>
            <textarea className="adm-input adm-textarea" value={form.details} onChange={set('details')} placeholder="Extended details shown when customer expands the card…" maxLength={2000} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="adm-label">Price (₹ per KG) — Optional</label>
              <input
                className={`adm-input ${errors.price ? 'error' : ''}`}
                type="number" min="0" step="0.01"
                value={form.price} onChange={set('price')}
                placeholder="Leave blank to hide price"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Enable/Disable */}
            <div>
              <label className="adm-label">Status</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="adm-toggle">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))}
                  />
                  <span className="adm-toggle-track" />
                </label>
                <span className="text-sm" style={{ color: form.enabled ? 'var(--adm-success)' : 'var(--adm-text-3)' }}>
                  {form.enabled ? 'Visible to customers' : 'Hidden from customers'}
                </span>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="adm-label">Badge Label</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {BADGE_OPTIONS.map(b => (
                <button
                  key={b.label}
                  onClick={() => setBadge(b)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={form.badge === b.label
                    ? { borderColor: 'var(--adm-gold)', background: 'rgba(201,149,42,0.15)', color: 'var(--adm-gold-light)' }
                    : { borderColor: 'var(--adm-border)', color: 'var(--adm-text-2)', background: 'transparent' }
                  }
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Existing images */}
          {form.images?.length > 0 && (
            <div>
              <label className="adm-label">Current Images</label>
              <div className="adm-img-grid mt-2">
                {form.images.map((img, i) => (
                  <div key={i} className="adm-img-thumb">
                    <img src={img.url} alt={`Product image ${i + 1}`} />
                    <div className="adm-img-actions">
                      <button onClick={() => removeImage(i)} title="Remove image">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <div>
            <label className="adm-label">
              {form.images?.length > 0 ? 'Add More Images' : 'Product Images'}
            </label>
            <ImageUploader
              authFetch={authFetch}
              onUploaded={handleImageUploaded}
              maxFiles={5 - (form.images?.length || 0)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t" style={{ borderColor: 'var(--adm-border)' }}>
          <button onClick={onClose} className="adm-btn adm-btn-ghost" disabled={saving}>Cancel</button>
          <button onClick={handleSave} className="adm-btn adm-btn-gold" disabled={saving}>
            {saving ? <span className="adm-spinner" /> : (product ? 'Save Changes' : 'Add Product')}
          </button>
        </div>
      </div>
    </div>
  )
}
