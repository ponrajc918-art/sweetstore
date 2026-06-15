import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',       href: '#home'      },
  { label: 'About',      href: '#about'     },
  { label: 'Products',   href: '#products'  },
  { label: 'Wholesale',  href: '#wholesale' },
  { label: 'Reviews',    href: '#reviews'   },
  { label: 'Contact',    href: '#contact'   },
]

const WA_LINK = 'https://wa.me/919677690323?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order%20with%20JS%20Palkova.'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNav = (href) => {
    setActiveLink(href)
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-glass shadow-sm' : 'navbar-transparent'
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        style={{ height: '72px' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNav('#home') }}
          className="flex-shrink-0 flex items-center"
          aria-label="JS Palkova – Home"
        >
          <img
            src="/images/logo.webp"
            alt="JS Palkova Logo"
            className="object-contain w-auto"
            style={{ height: '56px' }}
            width="56"
            height="56"
            loading="eager"
          />
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2" role="list">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <button
                onClick={() => handleNav(href)}
                className={`px-3 py-2 text-sm font-body font-medium rounded-lg transition-colors duration-200 ${
                  activeLink === href
                    ? 'text-gold-600'
                    : scrolled
                      ? 'text-charcoal-800 hover:text-gold-600'
                      : 'text-white/90 hover:text-gold-300'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-gold items-center gap-2"
          aria-label="Order on WhatsApp"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Order Now
        </a>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'text-charcoal-800' : 'text-white'
          }`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden navbar-glass border-t border-gold-500/10 shadow-lg">
          <ul className="px-4 py-3 space-y-1" role="list">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <button
                  onClick={() => handleNav(href)}
                  className="w-full text-left px-4 py-3 text-charcoal-800 font-medium rounded-xl hover:bg-gold-500/10 hover:text-gold-600 transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
            <li className="pt-2 pb-1">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 btn-gold w-full"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.115 1.529 5.845L.057 23.869a.5.5 0 0 0 .609.61l6.102-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.407l-.374-.221-3.876.929.967-3.794-.243-.392A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Order Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
