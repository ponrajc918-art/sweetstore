import { useState, useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'

const FIELDS = [
  { key: 'hero_headline',     label: 'Hero Headline',          hint: 'Main title shown in the hero slider',              type: 'text',     section: 'Hero Section'   },
  { key: 'hero_subheadline',  label: 'Hero Sub-headline',      hint: 'Supporting text below the main headline',          type: 'textarea', section: 'Hero Section'   },
  { key: 'promo_banner',      label: 'Promotional Banner Text',hint: 'Short promo or seasonal offer (leave blank to hide)', type: 'text',   section: 'Hero Section'   },
  { key: 'about_heading',     label: 'About Section Heading',  hint: 'Heading in the About section',                     type: 'text',     section: 'About Section'  },
  { key: 'about_body',        label: 'About Body Text',        hint: 'First paragraph in the About section',             type: 'textarea', section: 'About Section'  },
  { key: 'products_heading',  label: 'Products Section Heading',hint: 'Title shown above the product grid',              type: 'text',     section: 'Products'       },
  { key: 'wholesale_heading', label: 'Wholesale Heading',      hint: 'Title in the wholesale section',                   type: 'text',     section: 'Wholesale'      },
  { key: 'whatsapp_number',   label: 'WhatsApp Number',        hint: 'Country code + number, no spaces (e.g. 919677690323)', type: 'text', section: 'Contact'       },
  { key: 'contact_phone',     label: 'Display Phone Number',   hint: 'Formatted number shown on site (e.g. +91 96776 90323)', type: 'text', section: 'Contact'      },
  { key: 'service_area',      label: 'Service Area Text',      hint: 'Text shown in the Contact section under location', type: 'text',     section: 'Contact'        },
  { key: 'featured_products', label: 'Featured Product IDs',   hint: 'Comma-separated product IDs to highlight (optional)', type: 'text', section: 'Products'       },
]

export default function ContentManagement({ admin, onLogout, authFetch, toast }) {
  const [content, setContent]   = useState({})
  const [original, setOriginal] = useState({})
  const [saving,   setSaving]   = useState({})
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => { setContent(d.content || {}); setOriginal(d.content || {}) })
      .catch(() => toast.error('Failed to load content.'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  const set = (key) => (e) => setContent(c => ({ ...c, [key]: e.target.value }))

  const saveField = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    try {
      const res  = await authFetch('/api/content', { method: 'PUT', body: JSON.stringify({ key, value: content[key] }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOriginal(o => ({ ...o, [key]: content[key] }))
      toast.success(`"${FIELDS.find(f => f.key === key)?.label}" saved.`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(s => ({ ...s, [key]: false }))
    }
  }

  const resetField = (key) => setContent(c => ({ ...c, [key]: original[key] || '' }))

  const isDirty = (key) => content[key] !== original[key]

  // Group fields by section
  const sections = [...new Set(FIELDS.map(f => f.section))]

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout} pageTitle="Content Manager">
        <div className="flex items-center justify-center p-24">
          <span className="adm-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} pageTitle="Content Manager">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="adm-card adm-card-gold">
          <p className="text-sm" style={{ color: 'var(--adm-text-2)' }}>
            Changes save immediately per field. The live website reflects updates within seconds.
            Fields marked <span style={{ color: 'var(--adm-gold)' }}>●</span> have unsaved changes.
          </p>
        </div>

        {sections.map(section => (
          <div key={section}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--adm-text-3)' }}>
              {section}
            </h3>

            <div className="space-y-5">
              {FIELDS.filter(f => f.section === section).map(field => (
                <div key={field.key} className="adm-card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor={field.key} className="adm-label" style={{ margin: 0 }}>
                        {field.label}
                      </label>
                      {isDirty(field.key) && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,149,42,0.15)', color: 'var(--adm-gold-light)' }}>
                          Unsaved
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {isDirty(field.key) && (
                        <button onClick={() => resetField(field.key)} className="adm-btn adm-btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }}>
                          <RotateCcw size={13} /> Reset
                        </button>
                      )}
                      <button
                        onClick={() => saveField(field.key)}
                        disabled={!isDirty(field.key) || saving[field.key]}
                        className="adm-btn adm-btn-gold"
                        style={{ padding: '5px 14px', fontSize: 12 }}
                      >
                        {saving[field.key] ? <span className="adm-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <><Save size={13} /> Save</>}
                      </button>
                    </div>
                  </div>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.key}
                      className="adm-input adm-textarea"
                      value={content[field.key] || ''}
                      onChange={set(field.key)}
                      rows={3}
                    />
                  ) : (
                    <input
                      id={field.key}
                      type="text"
                      className="adm-input"
                      value={content[field.key] || ''}
                      onChange={set(field.key)}
                    />
                  )}

                  <p className="text-xs mt-2" style={{ color: 'var(--adm-text-3)' }}>{field.hint}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
