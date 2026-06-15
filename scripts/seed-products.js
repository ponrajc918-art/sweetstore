/**
 * Seed the initial 5 products from the existing hardcoded data into MongoDB.
 * Run AFTER setup-admin.js.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-products.js
 */

import { MongoClient } from 'mongodb'

const uri    = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'jspalkova'

if (!uri) {
  console.error('❌ MONGODB_URI not set.')
  process.exit(1)
}

const INITIAL_PRODUCTS = [
  {
    name:        'Milk Palkova',
    description: 'Classic, creamy milk palkova with rich dairy flavour and perfect traditional sweetness. Ideal for everyday retail and gifting.',
    details:     'Made from fresh milk, slowly reduced to a rich, fudgy consistency. Perfect for weddings, festivals, and everyday indulgence.',
    badge:       'Classic',
    badgeColor:  'bg-blue-50 text-blue-700',
    images:      [{ url: '/images/product-1-milk.webp', publicId: null }],
    price:       null,
    enabled:     true,
    order:       0,
  },
  {
    name:        'Premium Palkova',
    description: 'Elevated palkova made with select premium-grade ingredients, delivering a refined taste experience for discerning customers.',
    details:     'Richer texture, finer grain, and a longer shelf life. Preferred by premium sweet shops and high-end events.',
    badge:       'Premium',
    badgeColor:  'bg-gold-200 text-gold-700',
    images:      [{ url: '/images/product-2-premium.webp', publicId: null }],
    price:       null,
    enabled:     true,
    order:       1,
  },
  {
    name:        'Ghee Palkova',
    description: 'Enriched with pure desi ghee, this palkova delivers an aromatic, melt-in-the-mouth profile that customers love.',
    details:     'The addition of clarified butter adds depth and a distinctive golden colour. Our highest-demand product for bulk orders.',
    badge:       'Bestseller',
    badgeColor:  'bg-green-50 text-green-700',
    images:      [{ url: '/images/product-3-ghee.webp', publicId: null }],
    price:       null,
    enabled:     true,
    order:       2,
  },
  {
    name:        'Special Palkova',
    description: 'Our signature special variety crafted with premium ingredients, available exclusively through JS Palkova.',
    details:     'A unique formulation reserved for festivals and celebrations. Available in select quantities — order early.',
    badge:       'Special',
    badgeColor:  'bg-rose-50 text-rose-700',
    images:      [{ url: '/images/product-4-special.webp', publicId: null }],
    price:       null,
    enabled:     true,
    order:       3,
  },
  {
    name:        'Assorted Collection',
    description: 'A curated mix of all our palkova varieties in one premium package — perfect for gifting, events, and wholesale sampling.',
    details:     'Includes Milk, Premium, Ghee, and Special varieties. Great for corporates, sweet shops, and gift hampers.',
    badge:       'Popular',
    badgeColor:  'bg-purple-50 text-purple-700',
    images:      [{ url: '/images/product-5-assorted.webp', publicId: null }],
    price:       null,
    enabled:     true,
    order:       4,
  },
]

const client = new MongoClient(uri)

async function main() {
  await client.connect()
  const db  = client.db(dbName)
  const col = db.collection('products')

  const existing = await col.countDocuments()
  if (existing > 0) {
    console.warn(`⚠️  ${existing} product(s) already exist. Skipping seed.`)
    return
  }

  const products = INITIAL_PRODUCTS.map(p => ({
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  await col.insertMany(products)
  console.log(`✓ Seeded ${products.length} products into MongoDB`)
}

main()
  .then(() => process.exit(0))
  .catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1) })
  .finally(() => client.close())
