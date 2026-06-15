/**
 * Input validation and sanitization utilities.
 * All user input passes through these before touching the database.
 */

/**
 * Strip HTML tags and dangerous characters (basic XSS protection)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<[^>]*>/g, '')           // strip HTML
    .replace(/[<>&"'`]/g, (c) => ({     // encode remaining specials
      '<': '&lt;', '>': '&gt;', '&': '&amp;',
      '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
    })[c])
    .trim()
    .slice(0, 5000)                    // max length
}

/**
 * Validate admin login credentials format
 */
export function validateLoginInput({ userId, password }) {
  const errors = []

  if (!userId || typeof userId !== 'string' || userId.trim().length < 3) {
    errors.push('User ID must be at least 3 characters.')
  }
  if (userId && userId.length > 50) {
    errors.push('User ID must not exceed 50 characters.')
  }
  if (!password || typeof password !== 'string' || password.length < 1) {
    errors.push('Password is required.')
  }

  return errors
}

/**
 * Validate new admin credentials (for reset)
 */
export function validateNewCredentials({ userId, password }) {
  const errors = []

  if (!userId || userId.trim().length < 3) {
    errors.push('User ID must be at least 3 characters.')
  }
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
    errors.push('User ID can only contain letters, numbers, and underscores.')
  }
  if (userId.length > 50) {
    errors.push('User ID must not exceed 50 characters.')
  }
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter.')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number.')
  }

  return errors
}

/**
 * Validate product data
 */
export function validateProduct({ name, description, price }) {
  const errors = []

  if (!name || name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters.')
  }
  if (name && name.length > 100) {
    errors.push('Product name must not exceed 100 characters.')
  }
  if (description && description.length > 2000) {
    errors.push('Description must not exceed 2000 characters.')
  }
  if (price !== undefined && price !== null && price !== '') {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push('Price must be a non-negative number.')
    }
    if (priceNum > 999999) {
      errors.push('Price value is unreasonably high.')
    }
  }

  return errors
}

/**
 * Validate OTP format
 */
export function validateOTP(code) {
  if (!code || typeof code !== 'string') return false
  return /^\d{6}$/.test(code.trim())
}

/**
 * Sanitize product object before saving to DB
 */
export function sanitizeProduct(product) {
  return {
    name:        sanitizeString(product.name || ''),
    description: sanitizeString(product.description || ''),
    details:     sanitizeString(product.details || ''),
    price:       product.price ? parseFloat(product.price) : null,
    badge:       sanitizeString(product.badge || ''),
    badgeColor:  sanitizeString(product.badgeColor || ''),
    enabled:     product.enabled !== false,
    images:      Array.isArray(product.images)
                   ? product.images.slice(0, 10).map(img => ({
                       url:      sanitizeString(img.url || ''),
                       publicId: sanitizeString(img.publicId || ''),
                     }))
                   : [],
  }
}

/**
 * Sanitize content object
 */
export function sanitizeContent(key, value) {
  return {
    key:   sanitizeString(key).slice(0, 100),
    value: sanitizeString(value).slice(0, 5000),
  }
}
