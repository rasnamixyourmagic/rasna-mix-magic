import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/recipes')({
  GET: async () => {
    try {
      const { connectToDatabase } = await import('../../lib/db')
      const { Recipe } = await import('../../lib/models')
      await connectToDatabase()
      const recipes = await Recipe.find({}).sort({ createdAt: -1 }).lean()
      return new Response(JSON.stringify(recipes), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('GET /api/recipes error:', err)
      return new Response(JSON.stringify({ error: 'Failed to fetch recipes' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },

  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { connectToDatabase } = await import('../../lib/db')
      const { Recipe, Setting } = await import('../../lib/models')
      await connectToDatabase()

      let initialStatus = 'Pending'
      try {
        // Check for flagged email
        const flaggedSetting = await Setting.findOne({ key: 'flaggedEmails' })
        const flaggedEmails: string[] = Array.isArray(flaggedSetting?.value) ? flaggedSetting.value : []
        const userEmail = (body.email || '').toLowerCase().trim()
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
        name: body.name,
        email: body.email,
        title: body.title,
        description: body.description,
        videoName: body.videoName ?? '',
        status: initialStatus,
      })
      return new Response(JSON.stringify(recipe), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('POST /api/recipes error:', err)
      return new Response(JSON.stringify({ error: 'Failed to save recipe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },

  PATCH: async ({ request }) => {
    try {
      const body = await request.json()
      const { _id, ...updateData } = body
      if (!_id) {
        return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      const { connectToDatabase } = await import('../../lib/db')
      const { Recipe } = await import('../../lib/models')
      await connectToDatabase()
      const updated = await Recipe.findByIdAndUpdate(_id, updateData, { new: true })
      if (!updated) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify(updated), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('PATCH /api/recipes error:', err)
      return new Response(JSON.stringify({ error: 'Failed to update recipe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },

  DELETE: async ({ request }) => {
    try {
      const url = new URL(request.url)
      let id = url.searchParams.get('id')
      if (!id) {
        try {
          const body = await request.json()
          id = body._id
        } catch {}
      }
      if (!id) {
        return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      const { connectToDatabase } = await import('../../lib/db')
      const { Recipe } = await import('../../lib/models')
      await connectToDatabase()
      const deleted = await Recipe.findByIdAndDelete(id)
      if (!deleted) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ success: true, message: 'Recipe deleted' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('DELETE /api/recipes error:', err)
      return new Response(JSON.stringify({ error: 'Failed to delete recipe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
})

