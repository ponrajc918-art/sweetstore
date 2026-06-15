import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '10+',  label: 'Years Serving Tamil Nadu'   },
  { value: '500+', label: 'Trusted Business Partners'  },
  { value: '5+',   label: 'Premium Palkova Varieties'  },
  { value: '24h',  label: 'Order Fulfilment'           },
]

const fadeLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x:   0, transition: { duration: 0.75, ease: 'easeOut' } },
}
const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x:  0, transition: { duration: 0.75, ease: 'easeOut', delay: 0.15 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.1 + 0.2 },
  }),
}

export default function About() {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="bg-cream-50 py-20 lg:py-28 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Image ── */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <img
                src="/images/about.webp"
                alt="JS Palkova – trusted palkova supplier with premium packaging"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4/5', objectPosition: 'center' }}
                loading="lazy"
                decoding="async"
                width="600"
                height="750"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark rounded-2xl px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-charcoal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Trusted Supplier</p>
                    <p className="text-white/60 text-xs">Premium quality, every order</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative gold ring */}
            <div
              className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full pointer-events-none"
              style={{ border: '2px solid rgba(201,149,42,0.15)', zIndex: -1 }}
            />
            <div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ border: '2px solid rgba(201,149,42,0.1)', zIndex: -1 }}
            />
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {/* Logo in about section */}
            <img
              src="/images/logo.webp"
              alt="JS Palkova"
              className="h-16 w-auto object-contain mb-6"
              loading="lazy"
            />

            <span className="inline-block text-gold-600 font-body text-sm font-semibold tracking-widest uppercase mb-3">
              About JS Palkova
            </span>

            <h2 className="section-heading mb-4">
              Tamil Nadu's Most Trusted Palkova Supplier
            </h2>

            <div className="gold-divider !mx-0 mb-6" />

            <div className="space-y-4 text-charcoal-700 font-body leading-relaxed mb-8">
              <p>
                JS Palkova is a dedicated retail and wholesale supplier of premium palkova products, proudly serving customers, businesses, and sweet shops across Tamil Nadu and India.
              </p>
              <p>
                We source only the finest quality palkova from trusted producers and supply it directly to retail customers, bulk buyers, event organizers, catering businesses, and wholesale partners — ensuring every delivery meets our exacting standards of freshness and quality.
              </p>
              <p>
                Whether you need a small retail order or a large-scale bulk supply for your business, JS Palkova is your reliable, professional partner for authentic traditional palkova.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="text-center bg-white rounded-2xl py-4 px-2 shadow-card"
                  style={{ border: '1px solid rgba(201,149,42,0.12)' }}
                >
                  <p className="font-display text-2xl font-bold text-gold-600">{s.value}</p>
                  <p className="text-xs text-charcoal-600 mt-1 leading-snug">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/919677690323?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20JS%20Palkova."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2"
            >
              Connect With Us
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
