import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }, []) // eslint-disable-line

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((msg, d) => push(msg, 'success', d), [push])
  const error   = useCallback((msg, d) => push(msg, 'error',   d ?? 6000), [push])
  const warning = useCallback((msg, d) => push(msg, 'warning', d), [push])
  const info    = useCallback((msg, d) => push(msg, 'info',    d), [push])

  return { toasts, push, remove, success, error, warning, info }
}
