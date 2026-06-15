import { getCollection, COLLECTIONS } from './db.js'

const MAX_ATTEMPTS    = 5   // lock after 5 failures
const WINDOW_MINUTES  = 15  // within 15 minutes
const LOCKOUT_MINUTES = 30  // locked for 30 minutes

/**
 * Record a failed login attempt for an IP.
 * Returns { blocked: true, retryAfter: Date } if IP is now locked,
 * or { blocked: false, attemptsLeft: number } otherwise.
 */
export async function recordFailedAttempt(ip) {
  const col       = await getCollection(COLLECTIONS.LOGIN_ATTEMPTS)
  const now       = new Date()
  const windowStart = new Date(now - WINDOW_MINUTES * 60 * 1000)

  const record = await col.findOne({ ip })

  // If currently locked
  if (record?.lockedUntil && record.lockedUntil > now) {
    return { blocked: true, retryAfter: record.lockedUntil }
  }

  if (!record || record.windowStart < windowStart) {
    // Fresh window
    await col.updateOne(
      { ip },
      { $set: { ip, count: 1, windowStart: now, lockedUntil: null, updatedAt: now } },
      { upsert: true }
    )
    return { blocked: false, attemptsLeft: MAX_ATTEMPTS - 1 }
  }

  const newCount = (record.count || 0) + 1

  if (newCount >= MAX_ATTEMPTS) {
    const lockUntil = new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000)
    await col.updateOne({ ip }, {
      $set: { count: newCount, lockedUntil: lockUntil, updatedAt: now }
    })
    return { blocked: true, retryAfter: lockUntil }
  }

  await col.updateOne({ ip }, { $set: { count: newCount, updatedAt: now } })
  return { blocked: false, attemptsLeft: MAX_ATTEMPTS - newCount }
}

/**
 * Check if an IP is currently blocked without recording an attempt.
 */
export async function isBlocked(ip) {
  const col    = await getCollection(COLLECTIONS.LOGIN_ATTEMPTS)
  const record = await col.findOne({ ip })
  if (!record?.lockedUntil) return { blocked: false }
  if (record.lockedUntil > new Date()) {
    return { blocked: true, retryAfter: record.lockedUntil }
  }
  return { blocked: false }
}

/**
 * Clear login attempts for an IP after successful login.
 */
export async function clearAttempts(ip) {
  const col = await getCollection(COLLECTIONS.LOGIN_ATTEMPTS)
  await col.deleteOne({ ip })
}

/**
 * Get client IP from Vercel request headers.
 */
export function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}
