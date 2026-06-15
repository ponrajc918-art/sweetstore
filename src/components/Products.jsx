import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'

const PHONE = '919677690323'

// ── Fallback products (used when API is unavailable) ─────────────────────────
const FALLBACK_PRODUCTS = [
  {
    _id: '1', name: 'Milk Palkova',
    images: [{ url: '/images/product-1-milk.webp' }],
    badge: 'Classic', badgeColor: 'bg-blue-50 text-blue-700',
    description: 'Classic, creamy milk palkova with rich dairy flavour and perfect traditional sweetness. Ideal for everyday retail and gifting.',
    details: 'Made from fresh milk, slowly reduced to a rich, fudgy consistency. Perfect for weddings, festivals, and everyday indulgence.',
    enabled: true, order: 0,
  },
  {
    _id: '2', name: 'Premium Palkova',
    images: [{ url: '/images/product-2-premium.webp' }],
    badge: 'Premium', badgeColor: 'bg-gold-200 text-gold-700',
    description: 'Elevated palkova made with select premium-grade ingredients, delivering a refined taste experience for discerning customers.',
    details: 'Richer texture, finer grain, and a longer shelf life. Preferred by premium sweet shops and high-end events.',
    enabled: true, order: 1,
  },
  {
    _id: '3', name: 'Ghee Palkova',
    images: [{ url: '/images/product-3-ghee.webp' }],
    badge: 'Bestseller', badgeColor: 'bg-green-50 text-green-700',
    description: 'Enriched with pure desi ghee, this palkova delivers an aromatic, melt-in-the-mouth profile that customers love.',
    details: 'The addition of clarified butter adds depth and a distinctive golden colour. Our highest-demand product for bulk orders.',
    enabled: true, order: 2,
  },
  {
    _id: '4', name: 'Special Palkova',
    images: [{ url: '/images/product-4-special.webp' }],
    badge: 'Special', badgeColor: 'bg-rose-50 text-rose-700',
    description: 'Our signature special variety crafted with premium ingredients, available exclusively through JS Palkova.',
    details: 'A unique formulation reserved for festivals and celebrations. Available in select quantities — order early.',
    enabled: true, order: 3,
  },
  {
    _id: '5', name: 'Assorted Collection',
    images: [{ url: '/images/product-5-assorted.webp' }],
    badge: 'Popular', badgeColor: 'bg-purple-50 text-purple-700',
    description: 'A curated mix of all our palkova varieties in one premium package — perfect for gifting, events, and wholesale sampling.',
    details: 'Includes Milk, Premium, Ghee, and Special varieties. Great for corporates, sweet shops, and gift hampers.',
    enabled: true, order: 4,
  },
]

function ProductCard({ product, index, inView }) {
  const [qty,        setQty]        = useState(1)
  const [showDetail, setShowDetail] = useState(false)

  const step   = 0.5
  const minQty = 0.5
  const maxQty = 50

  const increase = () => setQty(q => Math.min(+(q + step).toFixed(1), maxQty))
  const decrease = () => setQty(q => Math.max(+(q - step).toFixed(1), minQty))

  // Support both old format (product.image) and new DB format (product.images[])
  const imageUrl = product.images?.[0]?.url || product.image || '/images/product-1-milk.webp'

  const buildWAMessage = () => {
    const msg = encodeURIComponent(
      `*New Order – JS Palkova*\n\n` +
      `*Product:* ${product.name}\n` +
      `*Quantity:* ${qty} KG\n` +
      (product.price ? `*Price:* ₹${product.price}/kg\n` : '') +
      `\nPlease confirm availability and delivery.`
    )
    return `https://wa.me/${PHONE}?text=${msg}`
  }

  return (
    <motion.article
      className="product-card flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.1 }}
      aria-label={`Product: ${product.name}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img
          src={imageUrl}
          alt={`${product.name} – JS Palkova premium product`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${product.badgeColor || 'bg-gold-200 text-gold-700'}`}>
            {product.badge}
          </span>
        )}
        {product.price != null && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-charcoal-900/85 text-gold-300">
            ₹{product.price}/kg
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-charcoal-600 leading-relaxed mb-1">
          {product.description}
        </p>

        {showDetail && product.details && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-charcoal-500 leading-relaxed mt-2 pt-2 border-t border-cream-200"
          >
            {product.details}
          </motion.p>
        )}

        <div className="mt-auto pt-4 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-charcoal-600 font-medium">Quantity (KG)</span>
            <div className="flex items-center gap-3">
              <button onClick={decrease} className="qty-btn" aria-label="Decrease quantity" disabled={qty <= minQty}>−</button>
              <span className="font-body font-semibold text-charcoal-900 w-10 text-center">{qty} kg</span>
              <button onClick={increase} className="qty-btn" aria-label="Increase quantity" disabled={qty >= maxQty}>+</button>
            </div>
          </div>

          <div className="flex gap-2">
            {product.details && (
              <button
                onClick={() => setShowDetail(v => !v)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-charcoal-600 border border-charcoal-200 rounded-full hover:border-gold-400 hover:text-gold-600 transition-colors"
                aria-expanded={showDetail}
              >
                <Eye size={14} />
                {showDetail ? 'Less' : 'Details'}
              </button>
            )}
            <a
              href={buildWAMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-gold flex items-center justify-center gap-1.5 !py-2.5 !text-xs"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <ShoppingBag size={14} />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function Products() {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-60px' })
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [apiLoaded, setApiLoaded] = useState(false)

  // Fetch live products from API — silent fallback if API unavailable
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.products?.length) {
          setProducts(data.products)
          setApiLoaded(true)
        }
      })
      .catch(() => {}) // Keep fallback data on error
  }, [])

  return (
    <section id="products" className="bg-cream-100 py-20 lg:py-28" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-gold-600 font-body text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Our Products
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading"
          >
            Premium Palkova Varieties
          </motion.h2>
          <div className="gold-divider mt-4" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-subheading max-w-2xl mx-auto mt-4"
          >
            Carefully sourced and supplied with the highest quality standards. Available for retail, bulk, and wholesale orders across Tamil Nadu and India.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id || product.id} product={product} index={i} inView={inView} />
          ))}
        </div>

        {/* Bulk order CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 text-center bg-white rounded-3xl p-8 shadow-card"
          style={{ border: '1px solid rgba(201,149,42,0.15)' }}
        >
          <p className="font-display text-2xl font-semibold text-charcoal-900 mb-2">
            Need a Bulk or Wholesale Order?
          </p>
          <p className="text-charcoal-600 mb-6 max-w-xl mx-auto">
            We supply large-scale orders for sweet shops, caterers, event organizers, and businesses. Get in touch for custom pricing and priority delivery.
          </p>
          <a
            href="https://wa.me/919677690323?text=Hi%2C%20I%20need%20a%20bulk%20wholesale%20palkova%20order.%20Please%20share%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Enquire for Bulk Orders
          </a>
        </motion.div>
      </div>
    </section>
  )
}
