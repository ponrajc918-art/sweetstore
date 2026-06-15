import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { requireAuth } from '../../lib/auth.js'
import { validateProduct, sanitizeProduct } from '../../lib/validate.js'

export const config = {
  runtime: "nodejs20.x"
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    const col = await getCollection(COLLECTIONS.PRODUCTS)

    // ───────────── GET PRODUCTS ─────────────
    if (req.method === 'GET') {
      const isAdminRequest = req.query?.admin === 'true'

      if (isAdminRequest) {
        const payload = requireAuth(req, res)
        if (!payload) return
      }

      const filter = isAdminRequest ? {} : { enabled: true }

      const products = await col
        .find(filter)
        .sort({ order: 1, createdAt: 1 })
        .toArray()

      return res.status(200).json({ products })
    }

    // ───────────── CREATE PRODUCT ─────────────
    if (req.method === 'POST') {
      const payload = requireAuth(req, res)
      if (!payload) return

      const body = req.body || {}

      const errors = validateProduct(body)
      if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(' ') })
      }

      const lastProduct = await col.findOne({}, { sort: { order: -1 } })
      const nextOrder = (lastProduct?.order ?? -1) + 1

      const sanitized = sanitizeProduct(body)

      const newProduct = {
        ...sanitized,
        order: nextOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await col.insertOne(newProduct)

      return res.status(201).json({
        success: true,
        product: { ...newProduct, _id: result.insertedId }
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })

  } catch (err) {
    console.error('[products/index] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}