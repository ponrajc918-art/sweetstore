import formidable from 'formidable'
import { uploadImage, deleteImage } from '../lib/cloudinary.js'
import { requireAuth } from '../lib/auth.js'

// Disable Vercel's default body parser so formidable can handle multipart
export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const payload = requireAuth(req, res)
  if (!payload) return

  // ── POST: Upload image ──────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const form = formidable({
        maxFileSize:   8 * 1024 * 1024, // 8 MB limit
        maxFiles:      5,
        filter:        ({ mimetype }) => mimetype?.startsWith('image/'),
        uploadDir:     '/tmp',
        keepExtensions: true,
      })

      const [fields, files] = await form.parse(req)
      const folder = fields.folder?.[0] || 'jspalkova/products'

      const uploadedFiles = files.image || files.file || []
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]

      if (fileArray.length === 0 || !fileArray[0]?.filepath) {
        return res.status(400).json({ error: 'No valid image file received.' })
      }

      // Upload all files to Cloudinary
      const results = await Promise.all(
        fileArray.map(file => uploadImage(file.filepath, folder))
      )

      return res.status(200).json({ success: true, images: results })
    } catch (err) {
      console.error('[upload] POST error:', err.message)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 8 MB.' })
      }
      return res.status(500).json({ error: 'Upload failed. Check Cloudinary configuration.' })
    }
  }

  // ── DELETE: Remove image from Cloudinary ───────────────────────
  if (req.method === 'DELETE') {
    try {
      const { publicId } = req.body || {}
      if (!publicId) {
        return res.status(400).json({ error: 'publicId is required.' })
      }

      // Only allow deleting images in the jspalkova/ folder
      if (!String(publicId).startsWith('jspalkova/')) {
        return res.status(403).json({ error: 'Forbidden: cannot delete images outside jspalkova folder.' })
      }

      await deleteImage(publicId)
      return res.status(200).json({ success: true, message: 'Image deleted.' })
    } catch (err) {
      console.error('[upload] DELETE error:', err.message)
      return res.status(500).json({ error: 'Delete failed.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
