import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

const PHONE = '919677690323'
const PHONE_DISPLAY = '+91 96776 90323'

export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSend = (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    const text = encodeURIComponent(
      `*Contact via JS Palkova Website*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone || 'Not provided'}\n\n*Message:*\n${form.message}`
    )
    window.open(`https://wa.me/${PHONE}?text=${text}`, '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => { setSent(false); setForm({ name: '', phone: '', message: '' }) }, 3500)
  }

  const inputCls = `w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3
    text-charcoal-800 placeholder-charcoal-400 font-body text-sm
    transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500`

  return (
    <section id="contact" className="bg-cream-50 py-20 lg:py-28" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-gold-600 font-body text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading"
          >
            Contact JS Palkova
          </motion.h2>
          <div className="gold-divider mt-4" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-subheading max-w-xl mx-auto mt-4"
          >
            Reach out for retail orders, wholesale enquiries, or any questions. We respond quickly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Info + Map ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <a
                href={`tel:+${PHONE}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
                style={{ border: '1px solid rgba(201,149,42,0.1)' }}
                aria-label={`Call JS Palkova at ${PHONE_DISPLAY}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 group-hover:bg-gold-500/20 transition-colors flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-xs text-charcoal-500 uppercase tracking-wide font-semibold mb-0.5">Call Us</p>
                  <p className="text-charcoal-900 font-semibold text-sm">{PHONE_DISPLAY}</p>
                  <p className="text-xs text-charcoal-500">Mon – Sun, 8AM–8PM</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${PHONE}?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20JS%20Palkova%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
                style={{ border: '1px solid rgba(201,149,42,0.1)' }}
                aria-label="Chat on WhatsApp"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors flex-shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-charcoal-500 uppercase tracking-wide font-semibold mb-0.5">WhatsApp</p>
                  <p className="text-charcoal-900 font-semibold text-sm">{PHONE_DISPLAY}</p>
                  <p className="text-xs text-charcoal-500">Quick reply guaranteed</p>
                </div>
              </a>

              {/* Location */}
              <div
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card sm:col-span-2"
                style={{ border: '1px solid rgba(201,149,42,0.1)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-charcoal-500 uppercase tracking-wide font-semibold mb-0.5">Service Area</p>
                  <p className="text-charcoal-900 font-semibold text-sm">Tamil Nadu, India</p>
                  <p className="text-xs text-charcoal-500">Pan-India delivery available for bulk orders</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden shadow-card flex-1 min-h-64" style={{ border: '1px solid rgba(201,149,42,0.1)' }}>
              {/* Replace the src with your actual Google Maps embed URL */}
              <iframe
                title="JS Palkova location map – Tamil Nadu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497698.95282640164!2d79.6432786!3d11.1271225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361beba4e4d07%3A0x6f2a19b3bc1e2aea!2sTamil%20Nadu!5e0!3m2!1sen!2sin!4v1717200000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '260px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.2 }}
          >
            <div
              className="bg-white rounded-3xl p-7 sm:p-9 shadow-card h-full"
              style={{ border: '1px solid rgba(201,149,42,0.1)' }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">Send a Message</h3>
                  <p className="text-xs text-charcoal-500">We'll reply on WhatsApp</p>
                </div>
              </div>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <CheckCircle2 className="w-14 h-14 text-gold-500" />
                  <p className="font-display text-xl font-semibold text-charcoal-900">Message Sent!</p>
                  <p className="text-charcoal-500 text-sm text-center">
                    Complete the conversation on WhatsApp. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSend} noValidate className="flex flex-col gap-4" aria-label="Contact form">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-charcoal-600 text-xs font-semibold uppercase tracking-wide">
                      Name <span className="text-gold-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set('name')}
                      required
                      className={inputCls}
                      autoComplete="name"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="text-charcoal-600 text-xs font-semibold uppercase tracking-wide">
                      Phone (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="Your mobile number"
                      value={form.phone}
                      onChange={set('phone')}
                      className={inputCls}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="contact-message" className="text-charcoal-600 text-xs font-semibold uppercase tracking-wide">
                      Message <span className="text-gold-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Your enquiry, order details, or any question…"
                      value={form.message}
                      onChange={set('message')}
                      required
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold flex items-center justify-center gap-2 !py-4"
                  >
                    <Send size={16} />
                    Send via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
