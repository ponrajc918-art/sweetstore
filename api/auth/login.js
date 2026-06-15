import bcrypt from 'bcryptjs'
import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { createToken, setAuthCookies } from '../../lib/auth.js'
import { validateLoginInput } from '../../lib/validate.js'
import { recordFailedAttempt, isBlocked, clearAttempts, getClientIP } from '../../lib/rateLimit.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIP(req)

  try {
    // Rate limit check
    const block = await isBlocked(ip)
    if (block.blocked) {
      const minutesLeft = Math.ceil((block.retryAfter - Date.now()) / 60000)
      return res.status(429).json({
        error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
        retryAfter: block.retryAfter,
      })
    }

    const { userId, password } = req.body || {}

    // Validate input format
    const errors = validateLoginInput({ userId, password })
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] })
    }

    const col   = await getCollection(COLLECTIONS.ADMINS)
    const admin = await col.findOne({ userId: userId.trim().toLowerCase() })

    // Use timing-safe comparison regardless of whether user exists
    const passwordToCheck = admin?.passwordHash || '$2a$12$invalidhashfortimingprotection'
    const isValid = await bcrypt.compare(password, passwordToCheck)

    if (!admin || !isValid) {
      const result = await recordFailedAttempt(ip)
      if (result.blocked) {
        return res.status(429).json({
          error: 'Too many failed attempts. Account temporarily locked.',
          retryAfter: result.retryAfter,
        })
      }
      return res.status(401).json({
        error: `Invalid credentials. ${result.attemptsLeft} attempt(s) remaining.`,
      })
    }

    // Successful login
    await clearAttempts(ip)

    // Update last login timestamp
    await col.updateOne({ _id: admin._id }, { $set: { lastLogin: new Date() } })

    const { token, csrfToken } = createToken(admin._id.toString())
    setAuthCookies(res, token, csrfToken)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      csrfToken, // Send CSRF token in response body too (for immediate use)
    })
  } catch (err) {
    console.error('[auth/login] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
