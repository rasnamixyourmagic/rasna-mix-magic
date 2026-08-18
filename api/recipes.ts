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

// ── Recipe schema ────────────────────────────────────────────────────────────
const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoName: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
)

const Recipe = mongoose.models['Recipe'] || mongoose.model('Recipe', RecipeSchema)

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers so the browser can call this from any Vercel domain
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connect()

    if (req.method === 'GET') {
      const recipes = await Recipe.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(recipes)
    }

    if (req.method === 'POST') {
      const { name, email, title, description, videoName } = req.body as {
        name: string
        email: string
        title: string
        description: string
        videoName: string
      }
      const recipe = await Recipe.create({ name, email, title, description, videoName })
      return res.status(201).json(recipe)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/recipes]', message)
    return res.status(500).json({ error: message })
  }
}
