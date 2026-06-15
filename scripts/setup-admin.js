/**
 * One-time admin setup script.
 * Run once to create the initial admin account in MongoDB.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." MONGODB_DB=jspalkova \
 *   ADMIN_INITIAL_USER_ID=ponraj ADMIN_INITIAL_PASSWORD=YourPass123 \
 *   node scripts/setup-admin.js
 *
 * Or copy .env.example to .env.local, fill it in, then run:
 *   node --env-file=.env.local scripts/setup-admin.js
 */

import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri    = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'jspalkova'
const userId = process.env.ADMIN_INITIAL_USER_ID
const pass   = process.env.ADMIN_INITIAL_PASSWORD

if (!uri || !userId || !pass) {
  console.error('❌ Missing required environment variables:')
  console.error('   MONGODB_URI, ADMIN_INITIAL_USER_ID, ADMIN_INITIAL_PASSWORD')
  process.exit(1)
}

if (pass.length < 8) {
  console.error('❌ Password must be at least 8 characters.')
  process.exit(1)
}

const client = new MongoClient(uri)

async function main() {
  await client.connect()
  console.log('✓ Connected to MongoDB')

  const db  = client.db(dbName)
  const col = db.collection('admins')

  const existing = await col.findOne({})
  if (existing) {
    console.warn('⚠️  Admin already exists. To reset, delete the admins collection manually.')
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(pass, 12)

  await col.insertOne({
    userId:       userId.trim().toLowerCase(),
    passwordHash,
    createdAt:    new Date(),
    updatedAt:    new Date(),
    lastLogin:    null,
  })

  // Create indexes
  await col.createIndex({ userId: 1 }, { unique: true })

  // Content collection
  const contentCol = db.collection('content')
  await contentCol.createIndex({ key: 1 }, { unique: true })

  // Products collection
  const productsCol = db.collection('products')
  await productsCol.createIndex({ order: 1 })
  await productsCol.createIndex({ enabled: 1 })

  // OTP sessions with TTL
  const otpCol = db.collection('otp_sessions')
  await otpCol.createIndex({ emailHash: 1 })
  await otpCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

  // Login attempts
  const attemptsCol = db.collection('login_attempts')
  await attemptsCol.createIndex({ ip: 1 }, { unique: true })

  // Reset tokens with TTL
  const resetCol = db.collection('reset_tokens')
  await resetCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

  console.log(`✓ Admin created: userId="${userId.trim().toLowerCase()}"`)
  console.log('✓ Database indexes created')
  console.log('')
  console.log('🔐 IMPORTANT: Remove ADMIN_INITIAL_USER_ID and ADMIN_INITIAL_PASSWORD from your environment.')
  console.log('🌐 Your admin panel is at: https://your-domain.com/admin')
}

main()
  .then(() => process.exit(0))
  .catch(err => { console.error('❌ Setup failed:', err.message); process.exit(1) })
  .finally(() => client.close())
