import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { parse as parseCookies } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRY = '4h'
const COOKIE_NAME = 'jspalkova_admin_token'
const CSRF_COOKIE  = 'jspalkova_csrf'

if (!JWT_SECRET) {
  console.warn('[auth] WARNING: JWT_SECRET not set — this is a critical security issue in production.')
}

/**
 * Create signed JWT + CSRF token pair
 */
export function createToken(adminId) {
  const csrfToken = crypto.randomBytes(32).toString('hex')
  const token = jwt.sign(
    { sub: adminId, csrf: csrfToken },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY, issuer: 'jspalkova' }
  )
  return { token, csrfToken }
}

/**
 * Verify JWT and return payload, or throw
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { issuer: 'jspalkova' })
}

/**
 * Set secure auth cookies on response
 */
export function setAuthCookies(res, token, csrfToken) {
  const isProduction = process.env.NODE_ENV === 'production'
  const maxAge = 4 * 60 * 60 // 4 hours in seconds

  // HttpOnly JWT cookie — not readable by JavaScript
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${isProduction ? '; Secure' : ''}`,
    // CSRF token — readable by JS so it can be sent in headers
    `${CSRF_COOKIE}=${csrfToken}; Path=/; Max-Age=${maxAge}; SameSite=Strict${isProduction ? '; Secure' : ''}`,
  ])
}

/**
 * Clear auth cookies on logout
 */
export function clearAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    `${CSRF_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict`,
  ])
}

/**
 * Auth middleware — verifies JWT + CSRF on every protected request.
 * Returns the decoded payload, or sends 401 and returns null.
 */
export function requireAuth(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie || '')
    const token   = cookies[COOKIE_NAME]

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: no session' })
      return null
    }

    const payload = verifyToken(token)

    // CSRF double-submit check for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const csrfFromHeader = req.headers['x-csrf-token']
      const csrfFromCookie = cookies[CSRF_COOKIE]

      if (!csrfFromHeader || csrfFromHeader !== csrfFromCookie || csrfFromCookie !== payload.csrf) {
        res.status(403).json({ error: 'Forbidden: CSRF token mismatch' })
        return null
      }
    }

    return payload
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Session expired. Please log in again.' })
    } else {
      res.status(401).json({ error: 'Unauthorized: invalid session' })
    }
    return null
  }
}

/**
 * Get token from request cookies (for verify endpoint)
 */
export function getTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '')
  return cookies[COOKIE_NAME] || null
}
