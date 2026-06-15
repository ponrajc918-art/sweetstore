/**
 * MongoDB connection singleton.
 * Re-uses existing connection on warm serverless invocations
 * to avoid opening a new connection on every request.
 */

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'jspalkova'

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set.')
}

// Global cache so the connection persists across serverless invocations
let cachedClient = null
let cachedDb = null

export async function connectDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  await client.connect()
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getCollection(collectionName) {
  const { db } = await connectDB()
  return db.collection(collectionName)
}

// Collection name constants
export const COLLECTIONS = {
  ADMINS:        'admins',
  PRODUCTS:      'products',
  CONTENT:       'content',
  OTP_SESSIONS:  'otp_sessions',
  LOGIN_ATTEMPTS: 'login_attempts',
}
