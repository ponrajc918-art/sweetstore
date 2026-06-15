import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Bulk supply for sweet shops and retail chains',
  'Large-quantity orders for events and weddings',
  'Catering and restaurant supply partnerships',
  'Competitive wholesale pricing on all varieties',
  'Reliable delivery across all Tamil Nadu districts',
  'Consistent freshness — every batch, every time',
  'Flexible order quantities from 5 KG and above',
  'Dedicated account support for wholesale buyers',
]

const targets = [
  { icon: '🏪', label: 'Sweet Shops'        },
  { icon: '🎊', label: 'Event Organizers'  },
  { icon: '🍽️', label: 'Catering Businesses' },
  { icon: '📦', label: 'Bulk Buyers'        },
]

// SVG-only version of target cards (no emoji)
const targetsSVG = [
  {
    label: 'Sweet Shops',
    svg: (
      <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
  },
  {
    label: 'Event Organizers',
    svg: (
      <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Catering Businesses',
    svg: (
      <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    ),
  },
  {
    label: 'Bulk Buyers',
    svg: (
      <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
]

export default function Wholesale() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="wholesale" className="bg-charcoal-900 py-20 lg:py-28 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <span className="inline-block text-gold-400 font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Wholesale &amp; Bulk Supply
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
              Reliable Palkova Supply for Your Business
            </h2>

            <div className="w-16 h-0.5 bg-gold-gradient mb-6" />

            <p className="text-white/70 font-body text-base leading-relaxed mb-8">
              JS Palkova is the preferred wholesale and bulk palkova supplier for sweet shops, catering businesses, event organizers, and distribution partners across Tamil Nadu. We understand your business needs — consistent quality, timely delivery, and competitive pricing.
            </p>

            {/* Who We Serve */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {targetsSVG.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/8"
                >
                  {t.svg}
                  <span className="text-white/85 text-sm font-medium">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <ul className="space-y-2.5 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-white/75 text-sm">
                  <CheckCircle2 size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/919677690323?text=Hi%2C%20I%20am%20interested%20in%20wholesale%20palkova%20supply%20from%20JS%20Palkova."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Enquire on WhatsApp
              </a>
              <a
                href="tel:+919677690323"
                className="btn-outline-gold !border-white/30 !text-white/80 hover:!bg-white/10 hover:!text-white flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call Us Now
              </a>
            </div>
          </motion.div>

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <img
                src="/images/wholesale-1.webp"
                alt="JS Palkova wholesale packaging and bulk supply"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4/5', objectPosition: 'center' }}
                loading="lazy"
                decoding="async"
                width="600"
                height="750"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-5 glass-card rounded-2xl px-6 py-4 shadow-gold">
              <p className="text-gold-400 font-display text-3xl font-bold">500+</p>
              <p className="text-white/70 text-sm mt-0.5">Business Partners Served</p>
            </div>

            {/* Decorative gold border */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ border: '1px solid rgba(201,149,42,0.2)', margin: '-6px' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
