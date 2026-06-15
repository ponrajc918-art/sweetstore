import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes inactivity

export function useAdmin() {
  const [admin,        setAdmin]        = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [csrfToken,    setCsrfToken]    = useState(() => getCsrfFromCookie())
  const navigate = useNavigate()
  const timeoutRef = useRef(null)

  // Read CSRF cookie (set by server, readable by JS)
  function getCsrfFromCookie() {
    const match = document.cookie.match(/jspalkova_csrf=([^;]+)/)
    return match ? match[1] : null
  }

  // Refresh CSRF token from cookie
  const refreshCsrf = useCallback(() => {
    const token = getCsrfFromCookie()
    if (token) setCsrfToken(token)
    return token
  }, [])

  // Reset inactivity timer
  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current)
    if (admin) {
      timeoutRef.current = setTimeout(() => {
        logout('Session expired due to inactivity.')
      }, SESSION_TIMEOUT_MS)
    }
  }, [admin]) // eslint-disable-line

  // Track user activity to reset timer
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const reset  = () => resetTimer()
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, reset))
  }, [resetTimer])

  useEffect(() => {
    resetTimer()
    return () => clearTimeout(timeoutRef.current)
  }, [admin, resetTimer])

  // Verify existing session on mount
  useEffect(() => {
    let cancelled = false
    async function check() {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' })
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json()
            setAdmin(data)
            refreshCsrf()
          } else {
            setAdmin(null)
          }
        }
      } catch {
        if (!cancelled) setAdmin(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    check()
    return () => { cancelled = true }
  }, [refreshCsrf])

  // Authenticated fetch wrapper — adds CSRF header automatically
  const authFetch = useCallback(async (url, options = {}) => {
    const csrf = refreshCsrf()
    const headers = {
      'Content-Type': 'application/json',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      ...options.headers,
    }
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    })
  }, [refreshCsrf])

  const login = useCallback(async (userId, password) => {
    const res = await fetch('/api/auth/login', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ userId, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    if (data.csrfToken) setCsrfToken(data.csrfToken)
    setAdmin({ userId, authenticated: true })
    return data
  }, [])

  const logout = useCallback(async (reason = null) => {
    const csrf = refreshCsrf()
    await fetch('/api/auth/logout', {
      method:      'POST',
      credentials: 'include',
      headers:     {
        'Content-Type':  'application/json',
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
      },
    }).catch(() => {})
    setAdmin(null)
    setCsrfToken(null)
    clearTimeout(timeoutRef.current)
    navigate('/admin', { replace: true, state: reason ? { message: reason } : undefined })
  }, [navigate, refreshCsrf])

  return { admin, loading, csrfToken, login, logout, authFetch }
}
