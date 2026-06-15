import bcrypt from 'bcryptjs'
import { getCollection, COLLECTIONS } from '../lib/db.js'
import { validateNewCredentials } from '../lib/validate.js'

export default async function handler(req, res) {
  // Security headers
  res.setHeader('Content-Type', 'application/json')

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const col = await getCollection(COLLECTIONS.ADMINS)

    // Only allow setup if NO admin exists
    const existingAdmin = await col.findOne({})
    if (existingAdmin) {
      return res.status(403).json({
        error: 'Admin already configured. This endpoint is disabled.',
      })
    }

    const { userId, password } = req.body || {}

    const errors = validateNewCredentials({ userId, password })
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await col.insertOne({
      userId:       userId.trim().toLowerCase(),
      passwordHash,
      createdAt:    new Date(),
      updatedAt:    new Date(),
      lastLogin:    null,
    })

    // Create indexes for performance + uniqueness
    await col.createIndex({ userId: 1 }, { unique: true })

    // Create indexes for other collections
    const otpCol = await getCollection(COLLECTIONS.OTP_SESSIONS)
    await otpCol.createIndex({ emailHash: 1 })
    await otpCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    const attemptsCol = await getCollection(COLLECTIONS.LOGIN_ATTEMPTS)
    await attemptsCol.createIndex({ ip: 1 }, { unique: true })

    const productsCol = await getCollection(COLLECTIONS.PRODUCTS)
    await productsCol.createIndex({ order: 1 })
    await productsCol.createIndex({ enabled: 1 })

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully. Please delete ADMIN_INITIAL_USER_ID and ADMIN_INITIAL_PASSWORD from your environment variables.',
    })
  } catch (err) {
    console.error('[setup] Error:', err.message)
    return res.status(500).json({ error: 'Setup failed. Check server logs.' })
  }
}
