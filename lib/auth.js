import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { parse as parseCookies } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRY = '4h'

const COOKIE_NAME = 'jspalkova_admin_token'
const CSRF_COOKIE = 'jspalkova_csrf'

// ❗ HARD FAIL in production instead of silent warning
if (!JWT_SECRET) {
  throw new Error('[auth] JWT_SECRET is missing. Server cannot start securely.')
}

/**
 * Create JWT + CSRF token pair
 */
export function createToken(adminId) {
  const csrfToken = crypto.randomBytes(32).toString('hex')

  const token = jwt.sign(
    { sub: adminId, csrf: csrfToken },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
      issuer: 'jspalkova',
    }
  )

  return { token, csrfToken }
}

/**
 * Verify JWT safely
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'jspalkova',
  })
}

/**
 * Set auth cookies
 */
export function setAuthCookies(res, token, csrfToken) {
  const isProd = process.env.NODE_ENV === 'production'
  const maxAge = 4 * 60 * 60

  const cookieFlags = `Path=/; Max-Age=${maxAge}; SameSite=Lax`

  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; HttpOnly; ${cookieFlags}${isProd ? '; Secure' : ''}`,
    `${CSRF_COOKIE}=${csrfToken}; ${cookieFlags}${isProd ? '; Secure' : ''}`,
  ])
}

/**
 * Clear cookies
 */
export function clearAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
    `${CSRF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`,
  ])
}

/**
 * Auth middleware (safe + production stable)
 */
export function requireAuth(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie || '')
    const token = cookies[COOKIE_NAME]

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      return null
    }

    const payload = verifyToken(token)

    // CSRF check only for state-changing requests
    const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH']

    if (unsafeMethods.includes(req.method)) {
      const csrfHeader = req.headers['x-csrf-token']
      const csrfCookie = cookies[CSRF_COOKIE]

      if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie || csrfCookie !== payload.csrf) {
        res.status(403).json({ error: 'CSRF validation failed' })
        return null
      }
    }

    return payload
  } catch (err) {
    res.status(401).json({
      error: err.name === 'TokenExpiredError'
        ? 'Session expired'
        : 'Invalid token',
    })
    return null
  }
}

/**
 * Get token safely
 */
export function getTokenFromRequest(req) {
  try {
    const cookies = parseCookies(req.headers.cookie || '')
    return cookies[COOKIE_NAME] || null
  } catch {
    return null
  }
}