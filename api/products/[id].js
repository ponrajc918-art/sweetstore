import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { requireAuth } from '../../lib/auth.js'
import { validateProduct, sanitizeProduct } from '../../lib/validate.js'
import { ObjectId } from 'mongodb'

function toObjectId(id) {
  try { return new ObjectId(id) } catch { return null }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const { id } = req.query
  const objectId = toObjectId(id)

  if (!objectId) {
    return res.status(400).json({ error: 'Invalid product ID.' })
  }

  try {
    const col = await getCollection(COLLECTIONS.PRODUCTS)

    // ── GET: single product (public) ───────────────────────────────
    if (req.method === 'GET') {
      const product = await col.findOne({ _id: objectId })
      if (!product) return res.status(404).json({ error: 'Product not found.' })
      return res.status(200).json({ product })
    }

    // All mutations require authentication
    const payload = requireAuth(req, res)
    if (!payload) return

    // ── PUT: update product ────────────────────────────────────────
    if (req.method === 'PUT') {
      const body = req.body || {}

      // Allow partial updates (toggle enabled, change order, etc.)
      const updateFields = {}

      if (body.name !== undefined || body.description !== undefined || body.price !== undefined) {
        const errors = validateProduct(body)
        if (errors.length > 0) return res.status(400).json({ error: errors.join(' ') })
        const sanitized = sanitizeProduct({ ...body })
        Object.assign(updateFields, sanitized)
      }

      // Direct field updates (no validation needed for these)
      if (body.enabled !== undefined) updateFields.enabled = Boolean(body.enabled)
      if (body.order   !== undefined) updateFields.order   = Number(body.order)

      updateFields.updatedAt = new Date()

      const result = await col.findOneAndUpdate(
        { _id: objectId },
        { $set: updateFields },
        { returnDocument: 'after' }
      )

      if (!result) return res.status(404).json({ error: 'Product not found.' })
      return res.status(200).json({ success: true, product: result })
    }

    // ── DELETE: remove product ─────────────────────────────────────
    if (req.method === 'DELETE') {
      const result = await col.deleteOne({ _id: objectId })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found.' })
      }
      return res.status(200).json({ success: true, message: 'Product deleted.' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[products/[id]] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
