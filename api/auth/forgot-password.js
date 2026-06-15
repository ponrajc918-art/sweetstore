import { sendOTPEmail } from '../../lib/email.js'
import { isBlocked, recordFailedAttempt, getClientIP } from '../../lib/rateLimit.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIP(req)

  // Rate-limit OTP requests (same table as login — prevents OTP spam)
  const block = await isBlocked(ip)
  if (block.blocked) {
    const minutesLeft = Math.ceil((new Date(block.retryAfter) - Date.now()) / 60000)
    return res.status(429).json({
      error: `Too many requests. Try again in ${minutesLeft} minute(s).`,
    })
  }

  try {
    // Send OTP — recovery email read server-side only from env var
    const maskedEmail = await sendOTPEmail()

    return res.status(200).json({
      success: true,
      // Only return masked hint — e.g. "ch****@gmail.com"
      hint: `OTP sent to ${maskedEmail}`,
      expiresInMinutes: 10,
    })
  } catch (err) {
    console.error('[forgot-password] Error:', err.message)
    await recordFailedAttempt(ip)
    return res.status(500).json({
      error: 'Failed to send OTP. Check email configuration or try again later.',
    })
  }
}
