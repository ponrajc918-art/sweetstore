import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { validateNewCredentials } from '../../lib/validate.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { resetToken, userId, password } = req.body || {}

  if (!resetToken || typeof resetToken !== 'string') {
    return res.status(400).json({ error: 'Reset token is required.' })
  }

  // Validate new credentials
  const errors = validateNewCredentials({ userId, password })
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') })
  }

  try {
    // Verify reset token
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')
    const tokenCol  = await getCollection('reset_tokens')
    const tokenDoc  = await tokenCol.findOne({ tokenHash, used: false })

    if (!tokenDoc) {
      return res.status(400).json({ error: 'Invalid or expired reset token. Please restart the reset process.' })
    }

    if (new Date() > new Date(tokenDoc.expiresAt)) {
      await tokenCol.deleteOne({ _id: tokenDoc._id })
      return res.status(400).json({ error: 'Reset token has expired. Please restart the reset process.' })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12)

    // Update admin credentials
    const adminCol = await getCollection(COLLECTIONS.ADMINS)
    const result   = await adminCol.updateOne(
      {},
      {
        $set: {
          userId:       userId.trim().toLowerCase(),
          passwordHash,
          updatedAt:    new Date(),
        }
      }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Admin account not found.' })
    }

    // Invalidate the reset token
    await tokenCol.updateOne({ _id: tokenDoc._id }, { $set: { used: true } })

    return res.status(200).json({
      success: true,
      message: 'Credentials updated successfully. Please log in with your new credentials.',
    })
  } catch (err) {
    console.error('[reset-credentials] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
