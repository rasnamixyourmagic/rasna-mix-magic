import { createAPIFileRoute } from '@tanstack/react-start/api'

const DEFAULT_SETTINGS = {
  autoApprove: false,
  maintenanceMode: false,
  maxVideoSize: 50,
  allowedFormats: ['.mp4', '.mov', '.avi'],
  flaggedEmails: [],
}

export const APIRoute = createAPIFileRoute('/api/settings')({
  GET: async () => {
    try {
      const { connectToDatabase } = await import('../../lib/db')
      const { Setting } = await import('../../lib/models')
      await connectToDatabase()

      const settingsList = await Setting.find({}).lean()
      const settingsMap: Record<string, any> = { ...DEFAULT_SETTINGS }
      
      for (const item of settingsList) {
        settingsMap[item.key] = item.value
      }

      return new Response(JSON.stringify(settingsMap), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('GET /api/settings error:', err)
      return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },

  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { connectToDatabase } = await import('../../lib/db')
      const { Setting } = await import('../../lib/models')
      await connectToDatabase()

      const { key, value } = body
      if (!key) {
        return new Response(JSON.stringify({ error: 'Setting key is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const updated = await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      )

      return new Response(JSON.stringify(updated), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('POST /api/settings error:', err)
      return new Response(JSON.stringify({ error: 'Failed to save setting' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
})
