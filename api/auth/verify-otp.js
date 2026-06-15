import { verifyOTP } from '../../lib/email.js'
import { validateOTP } from '../../lib/validate.js'
import { recordFailedAttempt, getClientIP } from '../../lib/rateLimit.js'
import crypto from 'crypto'
import { getCollection, COLLECTIONS } from '../../lib/db.js'

// A short-lived "reset token" stored server-side after OTP verified
const RESET_TOKEN_EXPIRY_MINUTES = 10

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIP(req)
  const { otp } = req.body || {}

  if (!validateOTP(otp)) {
    return res.status(400).json({ error: 'OTP must be a 6-digit number.' })
  }

  try {
    const result = await verifyOTP(otp)

    if (!result.valid) {
      await recordFailedAttempt(ip)
      return res.status(400).json({ error: result.reason })
    }

    // Generate a short-lived reset token (not JWT — one-time credential reset token)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt  = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000)

    // Store hashed reset token temporarily
    const col = await getCollection('reset_tokens')
    await col.deleteMany({}) // Only one active reset token at a time
    await col.insertOne({
      tokenHash:  crypto.createHash('sha256').update(resetToken).digest('hex'),
      expiresAt,
      used:       false,
      createdAt:  new Date(),
    })
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    return res.status(200).json({
      success: true,
      resetToken, // Frontend stores this temporarily for the next step
      message:    'OTP verified. You may now reset your credentials.',
    })
  } catch (err) {
    console.error('[verify-otp] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
