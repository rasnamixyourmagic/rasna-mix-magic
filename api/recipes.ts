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

// ── Setting schema ───────────────────────────────────────────────────────────
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
})

const Setting = mongoose.models['Setting'] || mongoose.model('Setting', SettingSchema)

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers so the browser can call this from any domain
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await connect()

    // GET: Fetch all recipes
    if (req.method === 'GET') {
      const recipes = await Recipe.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(recipes)
    }

    // POST: Create or seed recipes
    if (req.method === 'POST') {
      const { action, name, email, title, description, videoName } = req.body || {}

      // Support database seeding for demo testing
      if (action === 'seed') {
        const mockRecipes = [
          {
            name: "Rahul Sharma",
            email: "rahul@example.com",
            title: "Tangerine Sunset Twist",
            description: "2 parts Orange Rasna Mix, 1 part fresh pineapple juice, a splash of lime, topped with carbonated club soda and mint. Shake over ice.",
            videoName: "orange_twist.mp4",
            status: "Pending",
            createdAt: new Date(Date.now() - 3 * 3600 * 1000)
          },
          {
            name: "Ananya Iyer",
            email: "ananya@example.com",
            title: "Minty Mango Sparkler",
            description: "Mango Rasna Mix blended with fresh mint leaves, coconut water, crushed ice, and raw organic honey. Refreshing summer mix!",
            videoName: "mango_sparkle.mov",
            status: "Active",
            createdAt: new Date(Date.now() - 24 * 3600 * 1000)
          },
          {
            name: "Kabir Mehta",
            email: "kabir@example.com",
            title: "Spicy Cola Delight",
            description: "Cola Rasna Mix infused with a pinch of black salt (kala namak), cumin powder, and fresh lime juice. Served chilled.",
            videoName: "spicy_cola.mp4",
            status: "Active",
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
          },
          {
            name: "Pooja Patel",
            email: "pooja@example.com",
            title: "Berry Blast Cooler",
            description: "A combination of Shahi Gulab Rasna Mix and raspberry pulp, served over shaved ice with fresh blueberries.",
            videoName: "berry_rose.avi",
            status: "Rejected",
            createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000)
          },
          {
            name: "Vikram Sen",
            email: "vikram@example.com",
            title: "Pineapple Mint Cooler",
            description: "Pineapple Rasna Mix, fresh cucumber juice, fresh mint leaves, coconut water, ginger juice, and black pepper. Perfect detox drink.",
            videoName: "pineapple_cucumber.mp4",
            status: "Pending",
            createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000)
          }
        ]
        
        await Recipe.deleteMany({}) // clear out any garbage/empty recipes
        const inserted = await Recipe.insertMany(mockRecipes)
        return res.status(201).json(inserted)
      }

      let initialStatus = 'Pending'
      try {
        // Check for flagged email
        const flaggedSetting = await Setting.findOne({ key: 'flaggedEmails' })
        const flaggedEmails: string[] = Array.isArray(flaggedSetting?.value) ? flaggedSetting.value : []
        const userEmail = (email || '').toLowerCase().trim()
        if (flaggedEmails.includes(userEmail)) {
          initialStatus = 'Rejected'
        } else {
          // Check for auto-approve settings
          const autoApproveSetting = await Setting.findOne({ key: 'autoApprove' })
          if (autoApproveSetting && autoApproveSetting.value === true) {
            initialStatus = 'Active'
          }
        }
      } catch (err) {
        console.error('Error fetching settings for POST recipe:', err)
      }

      const recipe = await Recipe.create({
        name,
        email,
        title,
        description,
        videoName: videoName ?? '',
        status: initialStatus,
      })
      return res.status(201).json(recipe)
    }

    // PATCH: Update recipe details or status
    if (req.method === 'PATCH') {
      const { _id, ...updateData } = req.body || {}
      if (!_id) {
        return res.status(400).json({ error: 'Recipe ID is required' })
      }
      const updated = await Recipe.findByIdAndUpdate(_id, updateData, { new: true })
      if (!updated) {
        return res.status(404).json({ error: 'Recipe not found' })
      }
      return res.status(200).json(updated)
    }

    // DELETE: Remove recipe submission
    if (req.method === 'DELETE') {
      let id = req.query.id
      if (!id && req.body) {
        id = req.body._id
      }
      if (!id) {
        return res.status(400).json({ error: 'Recipe ID is required' })
      }
      const deleted = await Recipe.findByIdAndDelete(id)
      if (!deleted) {
        return res.status(404).json({ error: 'Recipe not found' })
      }
      return res.status(200).json({ success: true, message: 'Recipe deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/recipes]', message)
    return res.status(500).json({ error: message })
  }
}
