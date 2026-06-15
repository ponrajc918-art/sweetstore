import { getCollection, COLLECTIONS } from '../../lib/db.js'
import { requireAuth } from '../../lib/auth.js'
import { sanitizeContent } from '../../lib/validate.js'

// Default content (used if not overridden in DB)
const DEFAULTS = {
  hero_headline:       "Tamil Nadu's Trusted Palkova Retail & Wholesale Supplier",
  hero_subheadline:    'Supplying Fresh Premium Palkova for Retail Customers, Bulk Orders, Sweet Shops, Events, and Businesses Across Tamil Nadu and India.',
  about_heading:       "Tamil Nadu's Most Trusted Palkova Supplier",
  about_body:          'JS Palkova is a dedicated retail and wholesale supplier of premium palkova products, proudly serving customers, businesses, and sweet shops across Tamil Nadu and India.',
  products_heading:    'Premium Palkova Varieties',
  wholesale_heading:   'Reliable Palkova Supply for Your Business',
  promo_banner:        '',
  featured_products:   '',
  whatsapp_number:     '919677690323',
  contact_phone:       '+91 96776 90323',
  service_area:        'Tamil Nadu, India',
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    const col = await getCollection(COLLECTIONS.CONTENT)

    // ── GET: Return all content (public for frontend) ───────────────
    if (req.method === 'GET') {
      const docs    = await col.find({}).toArray()
      const content = { ...DEFAULTS }
      for (const doc of docs) {
        content[doc.key] = doc.value
      }
      return res.status(200).json({ content })
    }

    // ── PUT: Update content (admin only) ───────────────────────────
    if (req.method === 'PUT') {
      const payload = requireAuth(req, res)
      if (!payload) return

      const { key, value } = req.body || {}

      if (!key) {
        return res.status(400).json({ error: 'Content key is required.' })
      }
      if (!Object.keys(DEFAULTS).includes(key)) {
        return res.status(400).json({ error: `Unknown content key: "${key}"` })
      }

      const sanitized = sanitizeContent(key, value || '')

      await col.updateOne(
        { key: sanitized.key },
        { $set: { key: sanitized.key, value: sanitized.value, updatedAt: new Date() } },
        { upsert: true }
      )

      return res.status(200).json({ success: true, key: sanitized.key, value: sanitized.value })
    }

    // ── PUT (bulk): Update multiple keys ───────────────────────────
    if (req.method === 'PATCH') {
      const payload = requireAuth(req, res)
      if (!payload) return

      const { updates } = req.body || {}
      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: 'updates must be an array of { key, value } objects.' })
      }

      const ops = updates
        .filter(u => Object.keys(DEFAULTS).includes(u.key))
        .map(u => {
          const s = sanitizeContent(u.key, u.value || '')
          return {
            updateOne: {
              filter: { key: s.key },
              update: { $set: { key: s.key, value: s.value, updatedAt: new Date() } },
              upsert: true,
            },
          }
        })

      if (ops.length > 0) await col.bulkWrite(ops)
      return res.status(200).json({ success: true, updated: ops.length })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[content] Error:', err.message)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
