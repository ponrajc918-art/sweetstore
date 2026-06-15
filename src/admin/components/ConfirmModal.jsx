import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel, loading = false }) {
  if (!open) return null

  return (
    <div className="adm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="adm-modal" style={{ maxWidth: '420px' }}>
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            danger ? 'bg-red-500/10' : 'bg-yellow-500/10'
          }`}>
            <AlertTriangle size={24} className={danger ? 'text-red-400' : 'text-yellow-400'} />
          </div>

          <h3 id="confirm-title" className="text-white font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--adm-text-2)' }}>{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={loading}
              className="adm-btn adm-btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`adm-btn ${danger ? 'adm-btn-danger' : 'adm-btn-gold'}`}
            >
              {loading ? <span className="adm-spinner" /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
