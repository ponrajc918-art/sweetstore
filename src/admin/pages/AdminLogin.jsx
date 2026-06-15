import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Shield, AlertCircle } from 'lucide-react'
import { useAdmin } from '../hooks/useAdmin'

export default function AdminLogin() {
  const [userId,   setUserId]   = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const { admin, login } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  // Show session expiry or other messages passed via router state
  const stateMessage = location.state?.message

  useEffect(() => {
    if (admin) navigate('/admin/dashboard', { replace: true })
  }, [admin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userId.trim() || !password) {
      setError('Please enter your User ID and Password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(userId.trim(), password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root adm-login-page">
      <div className="adm-login-card">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#E8B840,#C9952A)' }}>
            <Shield size={32} className="text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold">Admin Access</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-text-3)' }}>JS Palkova Management Panel</p>
        </div>

        {/* Session/state message */}
        {stateMessage && (
          <div className="adm-toast warning mb-5 rounded-xl">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{stateMessage}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="adm-toast error mb-5 rounded-xl">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* User ID */}
          <div className="mb-4">
            <label htmlFor="admin-userid" className="adm-label">User ID</label>
            <input
              id="admin-userid"
              type="text"
              className="adm-input"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Enter your admin user ID"
              autoComplete="username"
              autoFocus
              maxLength={50}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="admin-password" className="adm-label">Password</label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                className="adm-input pr-11"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--adm-text-3)' }}
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn-gold w-full py-3"
            disabled={loading}
          >
            {loading
              ? <span className="adm-spinner" />
              : <><LogIn size={18} /> Sign In</>
            }
          </button>
        </form>

        {/* Forgot password */}
        <div className="text-center mt-5">
          <Link
            to="/admin/forgot-password"
            className="text-sm transition-colors hover:underline"
            style={{ color: 'var(--adm-text-3)' }}
          >
            Forgot User ID or Password?
          </Link>
        </div>

        {/* Back to site */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-xs transition-colors hover:underline"
            style={{ color: 'var(--adm-text-3)' }}
          >
            ← Back to JS Palkova website
          </a>
        </div>
      </div>
    </div>
  )
}
