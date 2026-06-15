import { requireAuth } from '../../lib/auth.js'
import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = requireAuth(req, res)
  if (!payload) return // requireAuth already sent 401

  try {
    const col   = await getCollection(COLLECTIONS.ADMINS)
    const admin = await col.findOne({ _id: new ObjectId(payload.sub) })

    if (!admin) {
      return res.status(401).json({ error: 'Admin account not found' })
    }

    return res.status(200).json({
      authenticated: true,
      userId: admin.userId,
      lastLogin: admin.lastLogin,
    })
  } catch (err) {
    console.error('[auth/verify] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
