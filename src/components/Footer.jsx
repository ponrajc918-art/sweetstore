import { Phone, MapPin } from 'lucide-react'

const PHONE        = '919677690323'
const PHONE_DISPLAY = '+91 96776 90323'

const navLinks = [
  { label: 'Home',      href: '#home'      },
  { label: 'About',     href: '#about'     },
  { label: 'Products',  href: '#products'  },
  { label: 'Wholesale', href: '#wholesale' },
  { label: 'Reviews',   href: '#reviews'   },
  { label: 'Contact',   href: '#contact'   },
  { label: 'Order Now', href: '#order'     },
]

const products = [
  'Milk Palkova',
  'Premium Palkova',
  'Ghee Palkova',
  'Special Palkova',
  'Assorted Collection',
]

const scrollTo = (href) => {
  const id = href.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-charcoal-950 text-white/70"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollTo('#home') }}
              className="inline-block mb-5"
              aria-label="JS Palkova – Back to top"
            >
              <img
                src="/images/logo.webp"
                alt="JS Palkova"
                className="object-contain w-auto"
                style={{ height: '56px' }}
                width="56"
                height="56"
                loading="lazy"
              />
            </a>
            <p className="text-sm leading-relaxed text-white/55 mb-6">
              Tamil Nadu's trusted retail and wholesale palkova supplier. Fresh, premium palkova delivered to your door — for retail, bulk, events, and businesses across India.
            </p>
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${PHONE}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20JS%20Palkova.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-sm text-white/55 hover:text-gold-400 transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Our Products
            </h3>
            <ul className="space-y-3" role="list">
              {products.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => scrollTo('#products')}
                    className="text-sm text-white/55 hover:text-gold-400 transition-colors text-left"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4" role="list">
              <li>
                <a
                  href={`tel:+${PHONE}`}
                  className="flex items-start gap-3 text-sm text-white/55 hover:text-gold-400 transition-colors group"
                  aria-label={`Call us at ${PHONE_DISPLAY}`}
                >
                  <Phone size={16} className="flex-shrink-0 mt-0.5 group-hover:text-gold-400" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-white/55 hover:text-gold-400 transition-colors group"
                  aria-label="WhatsApp us"
                >
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-white/55">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Tamil Nadu, India<br />Pan-India delivery available</span>
                </div>
              </li>
            </ul>

            {/* SEO Keywords (Tamil) */}
            <div className="mt-8 pt-6 border-t border-white/8">
              <p className="text-xs text-white/25 leading-loose">
                ஜேஎஸ் பால்கோவா · பால்கோவா சப்ளையர் · தமிழ்நாடு பால்கோவா · மொத்த விற்பனை பால்கோவா
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; {year} JS Palkova. All rights reserved. Trusted retail &amp; wholesale palkova supplier, Tamil Nadu.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>JSPalkova.com</span>
            <span>·</span>
            <a href={`tel:+${PHONE}`} className="hover:text-white/50 transition-colors">
              {PHONE_DISPLAY}
            </a>
            <span>·</span>
            {/* Hidden admin access — low opacity, known only to site owner */}
            <a
              href="/admin"
              className="transition-all duration-300"
              style={{ opacity: 0.12 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.12'}
              aria-label="Admin"
              tabIndex={-1}
            >
              ⚙
            </a>
          </div>
        </div>
      </div>

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={`https://wa.me/${PHONE}?text=Hi%2C%20I%20would%20like%20to%20order%20from%20JS%20Palkova.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400
                   rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.5)] flex items-center justify-center
                   transition-all hover:scale-110 active:scale-100"
        aria-label="Open WhatsApp chat with JS Palkova"
        title="Order on WhatsApp"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>
    </footer>
  )
}
