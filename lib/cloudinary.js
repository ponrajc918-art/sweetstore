import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

function configure() {
  const cloud  = process.env.CLOUDINARY_CLOUD_NAME
  const key    = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET

  if (!cloud || !key || !secret) {
    throw new Error('Cloudinary credentials not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.')
  }

  cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret })
  return cloudinary
}

/**
 * Upload a local file path to Cloudinary with auto WebP conversion + optimization.
 * Returns { url, publicId, width, height }
 */
export async function uploadImage(filePath, folder = 'jspalkova/products') {
  const cld = configure()

  const result = await cld.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
    format: 'webp',           // Auto-convert to WebP
    quality: 'auto:good',    // Intelligent quality compression
    fetch_format: 'auto',
    flags: 'progressive',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
      { quality: 'auto:good' },
    ],
  })

  // Clean up temp file
  try { fs.unlinkSync(filePath) } catch {}

  return {
    url:       result.secure_url,
    publicId:  result.public_id,
    width:     result.width,
    height:    result.height,
    format:    result.format,
    bytes:     result.bytes,
  }
}

/**
 * Delete an image from Cloudinary by its public_id
 */
export async function deleteImage(publicId) {
  if (!publicId) return

  const cld = configure()
  try {
    await cld.uploader.destroy(publicId, { resource_type: 'image' })
  } catch (err) {
    console.error('[cloudinary] Failed to delete image:', publicId, err.message)
  }
}

/**
 * Get a Cloudinary image URL with on-the-fly transformations
 */
export function getOptimizedUrl(publicId, width = 800, height = 800) {
  const cld = configure()
  return cld.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    format: 'webp',
    fetch_format: 'auto',
    secure: true,
  })
}
