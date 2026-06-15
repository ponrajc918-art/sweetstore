import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const reviews = [
  {
    name:     'Rajesh Kumar',
    location: 'Chennai, Tamil Nadu',
    rating:   5,
    role:     'Sweet Shop Owner',
    text:     'Outstanding quality and incredibly consistent. We have been ordering monthly from JS Palkova for our sweet shop for over two years now. Every batch arrives fresh and our customers absolutely love it.',
  },
  {
    name:     'Priya Sundaram',
    location: 'Coimbatore, Tamil Nadu',
    rating:   5,
    role:     'Wholesale Buyer',
    text:     'The best wholesale palkova supplier in Tamil Nadu, without question. The ghee palkova is a bestseller in our store and JS Palkova never lets us down on quality or delivery timelines.',
  },
  {
    name:     'Arjun Moorthy',
    location: 'Madurai, Tamil Nadu',
    rating:   5,
    role:     'Restaurant Owner',
    text:     'Reliable, professional, and consistent. We source all our palkova requirements for our restaurant from JS Palkova. Two years of partnership and not a single compromise on quality.',
  },
  {
    name:     'Kavitha Rajan',
    location: 'Trichy, Tamil Nadu',
    rating:   5,
    role:     'Event Organizer',
    text:     'Ordered a large quantity of palkova for a 1500-guest wedding. JS Palkova delivered perfectly on time, fresh packaging, and the taste was exceptional. Our guests were full of compliments.',
  },
  {
    name:     'Suresh Babu',
    location: 'Tirunelveli, Tamil Nadu',
    rating:   5,
    role:     'Sweet Shop Owner',
    text:     'Premium palkova at genuinely competitive wholesale pricing. The assorted collection is our top-selling product this season. JS Palkova is now our exclusive palkova supplier.',
  },
  {
    name:     'Meena Krishnan',
    location: 'Salem, Tamil Nadu',
    rating:   5,
    role:     'Catering Business',
    text:     'As a catering business, reliability matters above all else. JS Palkova has never missed a deadline or delivered subpar product. Their professional approach sets them apart from every other supplier.',
  },
  {
    name:     'Vikram Nair',
    location: 'Erode, Tamil Nadu',
    rating:   5,
    role:     'Retail Customer',
    text:     'The special palkova variety is unlike anything else I have tasted. Authentic flavour, perfect texture, and the packaging is genuinely premium. My entire family now orders exclusively from JS Palkova.',
  },
  {
    name:     'Anitha Selvam',
    location: 'Vellore, Tamil Nadu',
    rating:   5,
    role:     'Corporate Gifting',
    text:     'Used JS Palkova for our Diwali corporate gifting this year. Beautifully packaged, great taste, on-time delivery. The recipients were very impressed and many reached out asking where we sourced the palkova.',
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <article
      className="glass-card rounded-2xl p-6 flex-shrink-0 flex flex-col gap-4"
      style={{ width: '320px' }}
      aria-label={`Review by ${review.name}`}
    >
      {/* Stars */}
      <StarRating count={review.rating} />

      {/* Quote */}
      <blockquote className="text-white/80 text-sm leading-relaxed flex-1">
        "{review.text}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Avatar initial */}
        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
          <span className="text-charcoal-900 font-bold text-sm">
            {review.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{review.name}</p>
          <p className="text-white/50 text-xs">{review.role} · {review.location}</p>
        </div>
      </div>
    </article>
  )
}

export default function Reviews() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Duplicate reviews for seamless infinite scroll
  const doubled = [...reviews, ...reviews]

  return (
    <section
      id="reviews"
      className="relative py-20 lg:py-28 overflow-hidden"
      ref={ref}
      aria-label="Customer reviews"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/reviews-bg.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Dark luxury overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,8,2,0.88)' }} />
        {/* Gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,149,42,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="inline-block text-gold-400 font-body text-sm font-semibold tracking-widest uppercase mb-3"
          >
            What Customers Say
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight"
          >
            Trusted by Hundreds Across Tamil Nadu
          </motion.h2>
          <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-4" />
        </div>

        {/* Infinite scroll track — no padding on sides, edge-to-edge */}
        <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div className="reviews-track py-2">
            {doubled.map((review, i) => (
              <div key={i} className="px-3">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-xl mx-auto mt-12 px-5 flex items-center justify-center gap-10"
        >
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-gold-400">4.9</p>
            <StarRating count={5} />
            <p className="text-white/50 text-xs mt-1">Average Rating</p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-gold-400">500+</p>
            <p className="text-white/60 text-sm mt-1">Happy Customers</p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-gold-400">10+</p>
            <p className="text-white/60 text-sm mt-1">Years of Trust</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
