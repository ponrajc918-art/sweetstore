import nodemailer from 'nodemailer'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { getCollection, COLLECTIONS } from './db.js'

// OTP config
const OTP_EXPIRY_MINUTES = 10
const OTP_LENGTH = 6
const MAX_OTP_ATTEMPTS = 3

/**
 * Create Gmail transporter using App Password.
 * Credentials come from environment variables only — never hardcoded.
 */
function createTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('Email credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

/**
 * Generate a cryptographically random OTP
 */
function generateOTP() {
  const buffer = crypto.randomBytes(3)
  const num = buffer.readUIntBE(0, 3)
  return String(num % Math.pow(10, OTP_LENGTH)).padStart(OTP_LENGTH, '0')
}

/**
 * Hash the recovery email consistently (so we can look it up without storing plaintext)
 */
function hashEmail(email) {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
}

/**
 * Send OTP email to the admin recovery address.
 * IMPORTANT: The recovery email (ADMIN_RECOVERY_EMAIL) never leaves the server.
 * The frontend only calls this API — it never sees the destination email.
 */
export async function sendOTPEmail() {
  const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL
  if (!recoveryEmail) {
    throw new Error('ADMIN_RECOVERY_EMAIL not configured.')
  }

  const otp = generateOTP()
  const otpHash = await bcrypt.hash(otp, 10)
  const emailHash = hashEmail(recoveryEmail)
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  // Store hashed OTP in DB (overwrite any existing for this email)
  const col = await getCollection(COLLECTIONS.OTP_SESSIONS)
  await col.deleteMany({ emailHash })
  await col.insertOne({
    emailHash,
    otpHash,
    expiresAt,
    attempts: 0,
    used: false,
    createdAt: new Date(),
  })

  // Send email — recipient determined server-side only
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"JS Palkova Admin" <${process.env.GMAIL_USER}>`,
    to: recoveryEmail,
    subject: '🔐 JS Palkova Admin — Password Reset OTP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f0f0f;color:#fff;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#C9952A,#E8B840);padding:24px;text-align:center;">
          <h1 style="margin:0;color:#0f0f0f;font-size:22px;font-weight:700;">JS Palkova Admin</h1>
          <p style="margin:4px 0 0;color:#0f0f0f;opacity:0.8;font-size:13px;">Password Reset Request</p>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#ccc;margin-top:0;">Your One-Time Password (OTP) for admin credential reset:</p>
          <div style="background:#1a1a1a;border:2px solid #C9952A;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#E8B840;">${otp}</span>
          </div>
          <p style="color:#999;font-size:13px;">⏱ This OTP expires in <strong style="color:#E8B840;">${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <p style="color:#999;font-size:13px;">❌ You only have <strong style="color:#E8B840;">${MAX_OTP_ATTEMPTS} attempts</strong> to verify this OTP.</p>
          <p style="color:#666;font-size:12px;margin-top:24px;border-top:1px solid #333;padding-top:16px;">
            If you did not request this, ignore this email. Your credentials remain unchanged.
          </p>
        </div>
      </div>
    `,
  })

  // Return a masked hint about destination (e.g. "****@gmail.com") — never full email
  const [local, domain] = recoveryEmail.split('@')
  const maskedLocal = local.slice(0, 2) + '****'
  return `${maskedLocal}@${domain}`
}

/**
 * Verify an OTP code.
 * Returns { valid: true } or { valid: false, reason: '...' }
 */
export async function verifyOTP(code) {
  const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL
  if (!recoveryEmail) throw new Error('ADMIN_RECOVERY_EMAIL not configured.')

  const emailHash = hashEmail(recoveryEmail)
  const col = await getCollection(COLLECTIONS.OTP_SESSIONS)
  const session = await col.findOne({ emailHash, used: false })

  if (!session) {
    return { valid: false, reason: 'No active OTP session. Please request a new OTP.' }
  }

  if (new Date() > new Date(session.expiresAt)) {
    await col.deleteOne({ _id: session._id })
    return { valid: false, reason: 'OTP has expired. Please request a new one.' }
  }

  if (session.attempts >= MAX_OTP_ATTEMPTS) {
    await col.deleteOne({ _id: session._id })
    return { valid: false, reason: 'Too many failed attempts. Please request a new OTP.' }
  }

  const isMatch = await bcrypt.compare(code.trim(), session.otpHash)

  if (!isMatch) {
    await col.updateOne({ _id: session._id }, { $inc: { attempts: 1 } })
    const remaining = MAX_OTP_ATTEMPTS - session.attempts - 1
    return { valid: false, reason: `Incorrect OTP. ${remaining} attempt(s) remaining.` }
  }

  // Mark as used
  await col.updateOne({ _id: session._id }, { $set: { used: true } })
  return { valid: true }
}
