import { clearAuthCookies } from '../../lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  clearAuthCookies(res)

  return res.status(200).json({ success: true, message: 'Logged out successfully' })
}
