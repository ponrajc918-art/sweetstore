import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle  size={18} />,
  error:   <XCircle      size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info          size={18} />,
}

export default function Toast({ toasts, remove }) {
  if (!toasts.length) return null

  return (
    <div className="adm-toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} className={`adm-toast ${t.type}`} role="alert">
          <span className="flex-shrink-0 mt-0.5">{ICONS[t.type]}</span>
          <span className="flex-1 text-sm leading-snug">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
