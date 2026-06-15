import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { requireAuth } from '../../lib/auth.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = requireAuth(req, res)
  if (!payload) return

  const { order } = req.body || {}

  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: 'order must be a non-empty array of { id, order } objects.' })
  }

  try {
    const col = await getCollection(COLLECTIONS.PRODUCTS)
    const ops = order.map(({ id, order: idx }) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: Number(idx), updatedAt: new Date() } },
      },
    }))

    await col.bulkWrite(ops)
    return res.status(200).json({ success: true, message: 'Products reordered.' })
  } catch (err) {
    console.error('[products/reorder] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
