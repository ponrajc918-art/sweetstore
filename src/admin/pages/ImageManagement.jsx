import { useState, useRef } from 'react'
import { Upload, Trash2, Copy, ExternalLink, Image as ImageIcon, CheckCircle } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ImageUploader from '../components/ImageUploader'
import ConfirmModal from '../components/ConfirmModal'

export default function ImageManagement({ admin, onLogout, authFetch, toast }) {
  const [uploaded,     setUploaded]     = useState([]) // images uploaded this session
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)
  const [copiedUrl,    setCopiedUrl]    = useState(null)
  const [showUploader, setShowUploader] = useState(true)
  const folderRef = useRef('jspalkova/products')

  const handleUploaded = (result) => {
    setUploaded(prev => [result, ...prev])
    toast.success('Image uploaded and optimized to WebP.')
  }

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast.info('URL copied to clipboard.')
    } catch {
      toast.error('Copy failed — please copy manually.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget?.publicId) {
      // Local-only images (no publicId) — just remove from session list
      setUploaded(prev => prev.filter(i => i.url !== deleteTarget.url))
      setDeleteTarget(null)
      return
    }
    setDeleting(true)
    try {
      const res  = await authFetch('/api/upload', {
        method: 'DELETE',
        body:   JSON.stringify({ publicId: deleteTarget.publicId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUploaded(prev => prev.filter(i => i.url !== deleteTarget.url))
      toast.success('Image deleted from Cloudinary.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} pageTitle="Image Manager">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Info banner */}
        <div className="adm-card adm-card-gold" style={{ background: 'linear-gradient(135deg, rgba(201,149,42,0.06), transparent)' }}>
          <div className="flex items-start gap-3">
            <ImageIcon size={20} style={{ color: 'var(--adm-gold)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-white text-sm font-semibold mb-1">Cloudinary Image CDN</p>
              <p className="text-sm" style={{ color: 'var(--adm-text-2)' }}>
                All images are auto-converted to <strong>WebP</strong> and optimized via Cloudinary CDN. Copy a URL after uploading and assign it to a product in Product Management.
              </p>
            </div>
          </div>
        </div>

        {/* Folder selector */}
        <div className="adm-card">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <label className="adm-label">Upload Folder</label>
              <select
                className="adm-input adm-select mt-1"
                defaultValue="jspalkova/products"
                onChange={e => { folderRef.current = e.target.value }}
              >
                <option value="jspalkova/products">Products</option>
                <option value="jspalkova/hero">Hero / Banners</option>
                <option value="jspalkova/about">About Section</option>
                <option value="jspalkova/wholesale">Wholesale</option>
                <option value="jspalkova/misc">Miscellaneous</option>
              </select>
            </div>
            <button
              onClick={() => setShowUploader(v => !v)}
              className="adm-btn adm-btn-ghost flex-shrink-0"
            >
              <Upload size={15} />
              {showUploader ? 'Hide Uploader' : 'Show Uploader'}
            </button>
          </div>

          {/* Uploader */}
          {showUploader && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--adm-border)' }}>
              <ImageUploader
                authFetch={authFetch}
                onUploaded={handleUploaded}
                folder={folderRef.current}
                maxFiles={10}
              />
            </div>
          )}
        </div>

        {/* Session uploads grid */}
        {uploaded.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--adm-text-3)' }}>
              Uploaded This Session ({uploaded.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploaded.map((img, i) => (
                <div key={i} className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Thumbnail */}
                  <div className="relative" style={{ aspectRatio: '1' }}>
                    <img
                      src={img.url}
                      alt={`Uploaded image ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} className="text-white" />
                      </a>
                      <button
                        onClick={() => handleCopyUrl(img.url)}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === img.url
                          ? <CheckCircle size={14} className="text-green-400" />
                          : <Copy size={14} className="text-white" />
                        }
                      </button>
                      <button
                        onClick={() => setDeleteTarget(img)}
                        className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center hover:bg-red-500/60 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 size={14} className="text-red-300" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--adm-text-2)' }}>
                      {img.width}×{img.height} · {(img.bytes / 1024).toFixed(0)} KB
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--adm-text-3)' }}>
                      {img.format?.toUpperCase()}
                    </p>
                    <button
                      onClick={() => handleCopyUrl(img.url)}
                      className="mt-2 w-full adm-btn adm-btn-ghost"
                      style={{ padding: '5px 10px', fontSize: 11 }}
                    >
                      {copiedUrl === img.url ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy URL</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {uploaded.length === 0 && (
          <div className="adm-card text-center py-12">
            <ImageIcon size={48} className="mx-auto mb-4" style={{ color: 'var(--adm-text-3)' }} />
            <p className="text-white font-medium mb-1">No images uploaded yet</p>
            <p className="text-sm" style={{ color: 'var(--adm-text-3)' }}>
              Use the uploader above to add images. They will appear here after upload.
            </p>
          </div>
        )}

        {/* How to use */}
        <div className="adm-card">
          <h4 className="text-white text-sm font-semibold mb-3">How to update a product image</h4>
          <ol className="space-y-2">
            {[
              'Upload your new image using the uploader above.',
              'Click "Copy URL" on the uploaded image.',
              'Go to Products → Edit the product.',
              'Remove the old image and paste the copied URL (already saved automatically via Cloudinary).',
              'Save the product.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--adm-text-2)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: 'rgba(201,149,42,0.15)', color: 'var(--adm-gold-light)' }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this image?"
        message={deleteTarget?.publicId
          ? 'This will permanently delete the image from Cloudinary. Products using this image will show a broken link.'
          : 'Remove this image from the session list.'
        }
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  )
}
