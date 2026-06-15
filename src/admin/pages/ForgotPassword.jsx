import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Shield } from 'lucide-react'

const STEPS = { REQUEST: 1, VERIFY: 2, RESET: 3, DONE: 4 }

export default function ForgotPassword() {
  const [step,       setStep]       = useState(STEPS.REQUEST)
  const [hint,       setHint]       = useState('')
  const [otp,        setOtp]        = useState('')
  const [resetToken, setResetToken] = useState('')
  const [userId,     setUserId]     = useState('')
  const [password,   setPassword]   = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  const navigate = useNavigate()

  // ── Step 1: Request OTP ────────────────────────────────────────
  const handleRequestOTP = async () => {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHint(data.hint)
      setStep(STEPS.VERIFY)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('OTP must be 6 digits.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ otp: otp.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResetToken(data.resetToken)
      setStep(STEPS.RESET)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: Reset Credentials ──────────────────────────────────
  const handleReset = async () => {
    if (!userId.trim() || userId.length < 3) { setError('User ID must be at least 3 characters.'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(userId))     { setError('User ID: letters, numbers, underscores only.'); return }
    if (password.length < 8)                  { setError('Password must be at least 8 characters.'); return }
    if (!/[A-Z]/.test(password))              { setError('Password needs at least one uppercase letter.'); return }
    if (!/[0-9]/.test(password))              { setError('Password needs at least one number.'); return }
    if (password !== confirmPwd)              { setError('Passwords do not match.'); return }

    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/reset-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ resetToken, userId: userId.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep(STEPS.DONE)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const pwdStrength = (() => {
    if (!password) return null
    let score = 0
    if (password.length >= 8)   score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  return (
    <div className="admin-root adm-login-page">
      <div className="adm-login-card" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(201,149,42,0.12)', border: '1px solid rgba(201,149,42,0.3)' }}>
            <KeyRound size={26} style={{ color: 'var(--adm-gold-light)' }} />
          </div>
          <h1 className="text-white text-xl font-bold">Reset Admin Credentials</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--adm-text-3)' }}>
            {step === STEPS.REQUEST && 'We\'ll send a one-time code to the registered email.'}
            {step === STEPS.VERIFY  && 'Enter the 6-digit code sent to your email.'}
            {step === STEPS.RESET   && 'Create your new User ID and Password.'}
            {step === STEPS.DONE    && 'Your credentials have been updated.'}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {[1,2,3].map(s => (
            <div key={s} className="w-2 h-2 rounded-full transition-all"
              style={{ background: step > s ? 'var(--adm-gold)' : step === s ? 'var(--adm-gold-light)' : 'var(--adm-surface-3)', width: step === s ? '24px' : '8px' }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="adm-toast error mb-5 rounded-xl">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ── Step 1: Request ── */}
        {step === STEPS.REQUEST && (
          <div>
            <div className="adm-card mb-5" style={{ textAlign: 'center' }}>
              <Mail size={32} className="mx-auto mb-2" style={{ color: 'var(--adm-gold)' }} />
              <p className="text-sm" style={{ color: 'var(--adm-text-2)' }}>
                A 6-digit OTP will be sent to the <strong className="text-white">registered recovery email</strong> address.
              </p>
            </div>
            <button onClick={handleRequestOTP} disabled={loading} className="adm-btn adm-btn-gold w-full py-3">
              {loading ? <span className="adm-spinner" /> : 'Send OTP to Recovery Email'}
            </button>
          </div>
        )}

        {/* ── Step 2: Verify OTP ── */}
        {step === STEPS.VERIFY && (
          <div>
            <p className="text-xs mb-4 px-1" style={{ color: 'var(--adm-text-2)' }}>{hint}</p>
            <div className="mb-5">
              <label className="adm-label">Enter 6-Digit OTP</label>
              <input
                className="adm-input text-center text-2xl tracking-widest font-bold"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs mt-1.5" style={{ color: 'var(--adm-text-3)' }}>
                OTP expires in 10 minutes · Max 3 attempts
              </p>
            </div>
            <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="adm-btn adm-btn-gold w-full py-3">
              {loading ? <span className="adm-spinner" /> : 'Verify OTP'}
            </button>
            <button onClick={() => { setStep(STEPS.REQUEST); setOtp(''); setError('') }}
              className="adm-btn adm-btn-ghost w-full mt-2 text-sm">
              Resend OTP
            </button>
          </div>
        )}

        {/* ── Step 3: New Credentials ── */}
        {step === STEPS.RESET && (
          <div className="space-y-4">
            <div>
              <label className="adm-label">New User ID</label>
              <input className="adm-input" type="text" value={userId} onChange={e => setUserId(e.target.value)}
                placeholder="letters, numbers, underscores" maxLength={50} autoFocus />
            </div>
            <div>
              <label className="adm-label">New Password</label>
              <div className="relative">
                <input className="adm-input pr-11" type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--adm-text-3)' }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength meter */}
              {pwdStrength !== null && (
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                      style={{ background: i <= pwdStrength ? ['','#ef4444','#f59e0b','#22c55e','#22c55e'][pwdStrength] : 'var(--adm-surface-3)' }}
                    />
                  ))}
                  <span className="text-xs ml-1" style={{ color: 'var(--adm-text-3)' }}>
                    {['','Weak','Fair','Good','Strong'][pwdStrength]}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="adm-label">Confirm Password</label>
              <input className="adm-input" type="password" value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)} placeholder="Repeat your new password" />
            </div>
            <button onClick={handleReset} disabled={loading} className="adm-btn adm-btn-gold w-full py-3">
              {loading ? <span className="adm-spinner" /> : <><Lock size={16} /> Save New Credentials</>}
            </button>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === STEPS.DONE && (
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--adm-success)' }} />
            <p className="text-white font-semibold mb-2">Credentials Updated!</p>
            <p className="text-sm mb-6" style={{ color: 'var(--adm-text-2)' }}>
              Log in with your new User ID and Password.
            </p>
            <button onClick={() => navigate('/admin', { replace: true })} className="adm-btn adm-btn-gold w-full py-3">
              Go to Login
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/admin" className="flex items-center justify-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--adm-text-3)' }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
