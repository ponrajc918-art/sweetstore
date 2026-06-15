import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    title: 'Premium Quality',
    desc:  'We source and supply only the finest palkova from trusted producers, ensuring every batch meets our strict quality standards.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Bulk Order Ready',
    desc:  'Specialized handling for large-scale orders — from 5 KG to tonnes. Perfect for sweet shops, caterers, and distribution businesses.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: 'Reliable Supply Chain',
    desc:  'Consistent, dependable supply with no shortfalls. We ensure your orders are fulfilled on time, every time, without compromise.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    title: 'Fast Delivery',
    desc:  'Prompt dispatch with careful packaging that preserves freshness. Delivering across all Tamil Nadu districts and pan-India.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: 'Customer Satisfaction',
    desc:  'Every order backed by our commitment to satisfaction. Hundreds of sweet shops and businesses trust us as their long-term partner.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
      </svg>
    ),
  },
  {
    title: 'Professional Packaging',
    desc:  'Premium packaging that ensures freshness and presentation. Hygienic, tamper-proof containers suitable for retail and gifting.',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
]

export default function WhyChooseUs() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="why-us" className="bg-cream-50 py-20 lg:py-28" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-gold-600 font-body text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading"
          >
            The JS Palkova Difference
          </motion.h2>
          <div className="gold-divider mt-4" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-subheading max-w-2xl mx-auto mt-4"
          >
            Six reasons why hundreds of businesses across Tamil Nadu trust JS Palkova as their preferred palkova supplier.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.08 + 0.15 }}
              className="group bg-white rounded-2xl p-7 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              style={{ border: '1px solid rgba(201,149,42,0.1)', willChange: 'transform' }}
            >
              {/* Icon circle */}
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-600 group-hover:bg-gold-500/20 transition-colors">
                {f.svg}
              </div>

              <h3 className="font-display text-xl font-semibold text-charcoal-900 mb-3">
                {f.title}
              </h3>
              <p className="text-charcoal-600 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2008 60%, #1A1A1A 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #E8B840 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C9952A 0%, transparent 50%)' }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8">
            <div>
              <p className="font-display text-white text-2xl font-semibold mb-1">
                Ready to partner with us?
              </p>
              <p className="text-white/60 text-sm">
                Join 500+ satisfied businesses. Contact us today for a wholesale quote.
              </p>
            </div>
            <a
              href="https://wa.me/919677690323?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20wholesale%20palkova%20supply."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold whitespace-nowrap flex-shrink-0"
            >
              Get a Wholesale Quote
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
