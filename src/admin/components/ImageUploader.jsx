import { useState, useRef, useCallback } from 'react'
import { Upload, X, Eye, Loader2 } from 'lucide-react'

export default function ImageUploader({ authFetch, onUploaded, folder = 'jspalkova/products', maxFiles = 5 }) {
  const [previews,   setPreviews]   = useState([]) // { file, dataUrl, uploading, result, error }
  const [dragging,   setDragging]   = useState(false)
  const inputRef = useRef(null)

  const processFiles = useCallback((fileList) => {
    const files   = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    const allowed = files.slice(0, maxFiles - previews.length)

    const newPreviews = allowed.map(file => ({
      id:        Math.random().toString(36).slice(2),
      file,
      dataUrl:   null,
      uploading: false,
      result:    null,
      error:     null,
    }))

    // Generate previews and auto-upload
    newPreviews.forEach(p => {
      const reader = new FileReader()
      reader.onload = e => {
        setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, dataUrl: e.target.result } : x))
      }
      reader.readAsDataURL(p.file)

      uploadFile(p)
    })

    setPreviews(prev => [...prev, ...newPreviews])
  }, [previews.length, maxFiles]) // eslint-disable-line

  const uploadFile = useCallback(async (p) => {
    setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, uploading: true } : x))

    try {
      const fd = new FormData()
      fd.append('image', p.file)
      fd.append('folder', folder)

      const res  = await authFetch('/api/upload', {
        method:  'POST',
        headers: {},           // Let browser set Content-Type with boundary
        body:    fd,
      })
      const data = await res.json()

      if (!res.ok || !data.images?.[0]) {
        throw new Error(data.error || 'Upload failed')
      }

      const result = data.images[0]
      setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, uploading: false, result } : x))
      onUploaded?.(result)
    } catch (err) {
      setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, uploading: false, error: err.message } : x))
    }
  }, [authFetch, folder, onUploaded])

  const remove = (id) => setPreviews(prev => prev.filter(x => x.id !== id))

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const uploading = previews.some(p => p.uploading)
  const allDone   = previews.length > 0 && !uploading

  return (
    <div>
      {/* Drop zone */}
      {previews.length < maxFiles && (
        <div
          className={`adm-dropzone ${dragging ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload images"
        >
          <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--adm-text-3)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--adm-text-2)' }}>
            Click to browse or drag & drop images
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-text-3)' }}>
            PNG, JPG, WEBP · Max 8 MB per file · Up to {maxFiles} files
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--adm-gold)' }}>
            Auto-converts to WebP + optimized on Cloudinary
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => processFiles(e.target.files)}
          />
        </div>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="adm-img-grid mt-4">
          {previews.map(p => (
            <div key={p.id} className="adm-img-thumb">
              {p.dataUrl
                ? <img src={p.dataUrl} alt="Upload preview" />
                : <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--adm-surface-2)' }}>
                    <Loader2 size={20} className="animate-spin" style={{ color: 'var(--adm-text-3)' }} />
                  </div>
              }

              {/* Overlay */}
              <div className="adm-img-actions">
                {p.uploading && <Loader2 size={20} className="animate-spin text-white" />}
                {p.error && (
                  <div className="text-center px-2">
                    <p className="text-red-400 text-xs">{p.error}</p>
                    <button
                      onClick={e => { e.stopPropagation(); uploadFile(p) }}
                      className="text-white text-xs mt-1 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {p.result && (
                  <a href={p.result.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                    <Eye size={18} className="text-white" />
                  </a>
                )}
                <button onClick={e => { e.stopPropagation(); remove(p.id) }}>
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Status badge */}
              {p.result && !p.uploading && (
                <div className="absolute bottom-1 left-1 right-1 text-center">
                  <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full">✓ Uploaded</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {allDone && previews.filter(p => p.result).length > 0 && (
        <p className="text-xs mt-3" style={{ color: 'var(--adm-success)' }}>
          ✓ {previews.filter(p => p.result).length} image(s) uploaded to Cloudinary
        </p>
      )}
    </div>
  )
}
