import type { VercelRequest, VercelResponse } from '@vercel/node'
import mongoose from 'mongoose'

// ── Mongoose connection (cached across warm invocations) ─────────────────────
let cached: typeof mongoose | null = null

async function connect() {
  if (cached) return cached
  const uri = process.env['MONGODB_URI']
  if (!uri) throw new Error('MONGODB_URI environment variable is not set')
  cached = await mongoose.connect(uri)
  return cached
}

// ── Setting schema ───────────────────────────────────────────────────────────
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
})

const Setting = mongoose.models['Setting'] || mongoose.model('Setting', SettingSchema)

const DEFAULT_SETTINGS = {
  autoApprove: false,
  maintenanceMode: false,
  maxVideoSize: 50,
  allowedFormats: ['.mp4', '.mov', '.avi'],
  flaggedEmails: [],
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers so the browser can call this from any domain
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connect()

    // GET: Retrieve all settings and merge with defaults
    if (req.method === 'GET') {
      const settingsList = await Setting.find({}).lean()
      const settingsMap: Record<string, any> = { ...DEFAULT_SETTINGS }
      
      for (const item of settingsList) {
        settingsMap[item.key] = item.value
      }

      return res.status(200).json(settingsMap)
    }

    // POST: Create or update a specific setting key
    if (req.method === 'POST') {
      const { key, value } = req.body || {}
      if (!key) {
        return res.status(400).json({ error: 'Setting key is required' })
      }

      const updated = await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      )

      return res.status(200).json(updated)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/settings]', message)
    return res.status(500).json({ error: message })
  }
}
