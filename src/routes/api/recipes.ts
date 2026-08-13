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
      const { Recipe } = await import('../../lib/models')
      await connectToDatabase()
      const recipe = await Recipe.create({
        name: body.name,
        email: body.email,
        title: body.title,
        description: body.description,
        videoName: body.videoName ?? '',
        status: 'Pending',
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
})
