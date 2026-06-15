import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react'

const PHONE = '919677690323'

const PRODUCTS = [
  'Milk Palkova',
  'Premium Palkova',
  'Ghee Palkova',
  'Special Palkova',
  'Assorted Collection',
  'Mixed / Wholesale Enquiry',
]

const initialForm = {
  name:       '',
  phone:      '',
  product:    '',
  quantity:   '',
  address:    '',
  additional: '',
  location:   '',
}

export default function OrderForm() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form,        setForm]        = useState(initialForm)
  const [errors,      setErrors]      = useState({})
  const [locLoading,  setLocLoading]  = useState(false)
  const [locSuccess,  setLocSuccess]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        setForm(f => ({ ...f, location: url }))
        setLocSuccess(true)
        setLocLoading(false)
      },
      () => {
        alert('Unable to retrieve your location. Please allow location access and try again.')
        setLocLoading(false)
      },
      { timeout: 10000 }
    )
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Name is required'
    if (!form.phone.trim())    e.phone    = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number'
    if (!form.product)         e.product  = 'Please select a product'
    if (!form.quantity.trim()) e.quantity = 'Quantity is required'
    if (!form.address.trim())  e.address  = 'Delivery address is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})

    const message = encodeURIComponent(
`*New Order – JS Palkova* 🛒

*Name:*
${form.name}

*Phone:*
${form.phone}

*Product:*
${form.product}

*Quantity:*
${form.quantity} KG

*Delivery Address:*
${form.address}

*Location (Map):*
${form.location || 'Not provided'}

*Additional Request:*
${form.additional || 'None'}

---
_Order placed via jspalkova.com_`
    )
    window.open(`https://wa.me/${PHONE}?text=${message}`, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm(initialForm)
      setLocSuccess(false)
    }, 4000)
  }

  const inputCls = (field) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm
    transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500
    ${errors[field] ? 'border-red-400' : 'border-white/10 hover:border-white/20'}`

  return (
    <section id="order" className="bg-charcoal-900 py-20 lg:py-28" ref={ref}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-gold-400 font-body text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Place an Order
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight"
          >
            Order via WhatsApp
          </motion.h2>
          <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-4" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 mt-4 max-w-lg mx-auto"
          >
            Fill in your details below. Your order message will be sent directly to us on WhatsApp.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="glass-card rounded-3xl p-6 sm:p-8"
        >
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-4" />
              <p className="font-display text-2xl font-semibold text-white mb-2">
                WhatsApp opened!
              </p>
              <p className="text-white/60">
                Complete your order by sending the pre-filled message on WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-label="Order form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-name" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Full Name <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={set('name')}
                    className={inputCls('name')}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-phone" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Phone Number <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputCls('phone')}
                    autoComplete="tel"
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                </div>

                {/* Product */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-product" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Product <span className="text-gold-500">*</span>
                  </label>
                  <select
                    id="order-product"
                    value={form.product}
                    onChange={set('product')}
                    className={`${inputCls('product')} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled style={{ background: '#2C2C2C' }}>Select a product</option>
                    {PRODUCTS.map(p => (
                      <option key={p} value={p} style={{ background: '#2C2C2C' }}>{p}</option>
                    ))}
                  </select>
                  {errors.product && <p className="text-red-400 text-xs">{errors.product}</p>}
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-qty" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Quantity (KG) <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="order-qty"
                    type="text"
                    placeholder="e.g. 5 KG or 50 KG"
                    value={form.quantity}
                    onChange={set('quantity')}
                    className={inputCls('quantity')}
                  />
                  {errors.quantity && <p className="text-red-400 text-xs">{errors.quantity}</p>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="order-address" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Delivery Address <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    id="order-address"
                    rows={3}
                    placeholder="Full delivery address including city, pincode"
                    value={form.address}
                    onChange={set('address')}
                    className={`${inputCls('address')} resize-none`}
                    autoComplete="street-address"
                  />
                  {errors.address && <p className="text-red-400 text-xs">{errors.address}</p>}
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Share Your Location (Optional)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      readOnly
                      placeholder="Google Maps URL will appear here"
                      value={form.location}
                      className={`${inputCls('location')} flex-1 cursor-default`}
                      aria-label="Google Maps URL"
                    />
                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={locLoading || locSuccess}
                      className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                        bg-gold-500/20 border border-gold-500/30 text-gold-400
                        hover:bg-gold-500/30 disabled:opacity-60 disabled:cursor-default"
                      aria-label="Get my location"
                    >
                      {locLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : locSuccess ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <MapPin size={16} />
                      )}
                      {locLoading ? 'Getting…' : locSuccess ? 'Got it!' : 'Get Location'}
                    </button>
                  </div>
                </div>

                {/* Additional Request */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="order-additional" className="text-white/70 text-xs font-medium tracking-wide uppercase">
                    Additional Request (Optional)
                  </label>
                  <textarea
                    id="order-additional"
                    rows={2}
                    placeholder="Any special instructions, packaging requirements, or questions…"
                    value={form.additional}
                    onChange={set('additional')}
                    className={`${inputCls('additional')} resize-none`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-6 w-full btn-gold flex items-center justify-center gap-3 !py-4 !text-base"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Send Order on WhatsApp
              </button>

              <p className="text-center text-white/30 text-xs mt-3">
                Tapping this button will open WhatsApp with your order details pre-filled.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
