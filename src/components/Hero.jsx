import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WA_LINK = 'https://wa.me/919677690323?text=Hi%2C%20I%20would%20like%20to%20order%20palkova%20from%20JS%20Palkova.'

const slides = [
  {
    image: '/images/hero-1.webp',
    alt:   'Premium JS Palkova pieces on dark luxury background',
  },
  {
    image: '/images/hero-2.webp',
    alt:   'JS Palkova packaged in premium branded containers',
  },
  {
    image: '/images/hero-3.webp',
    alt:   'Professional palkova packaging and quality assurance process',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-charcoal-950"
      style={{ minHeight: '100svh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero section"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="hero-slide"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
            style={{ position: 'absolute', inset: 0 }}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          {/* Dark overlay — lighter on right for image focus */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(10,8,2,0.82) 0%, rgba(10,8,2,0.72) 45%, rgba(10,8,2,0.28) 100%)',
            }}
          />
        </div>
      ))}

      {/* Gold accent line */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none"
        style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #E8B840, #C9952A, transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-full flex items-center" style={{ minHeight: '100svh' }}>
        <div className="w-full md:w-3/5 lg:w-1/2 pt-28 pb-28 md:pt-0 md:pb-0 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 text-gold-400 font-body text-sm font-medium tracking-widest uppercase mb-4">
                <span className="w-8 h-px bg-gold-400" />
                Trusted Supplier
                <span className="w-8 h-px bg-gold-400" />
              </span>

              {/* Headline */}
              <h1 className="font-display text-white leading-tight mb-5"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600 }}>
                Tamil Nadu's Trusted
                <span className="block text-gold-gradient bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Palkova Retail &amp;
                </span>
                Wholesale Supplier
              </h1>

              {/* Subheading */}
              <p className="text-white/75 font-body text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
                Supplying fresh premium palkova for retail customers, bulk orders, sweet shops, events, and businesses across Tamil Nadu and India.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={scrollToProducts}
                  className="btn-outline-gold border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900 px-8 py-3.5"
                >
                  View Products
                </button>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Order on WhatsApp
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Prev arrow */}
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-white/20 text-white/70 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-7 h-2 bg-gold-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          className="w-9 h-9 rounded-full border border-white/20 text-white/70 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}
