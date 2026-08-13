import * as React from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from 'vinxi/http'
import { useState } from 'react'
import { signToken } from '../lib/auth'

export const loginFn = createServerFn('POST', async ({ email, password }: { email: string; password: string }) => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    const token = signToken({ role: 'admin', email })
    setCookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
      path: '/'
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid credentials' }
})

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await loginFn({ data: { email, password } })
      
      if (result.success) {
        await router.invalidate()
        navigate({ to: '/admin/dashboard' })
      } else {
        setError(result.error || 'Failed to login')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-sunrise flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-[var(--radius-3xl)] shadow-juice animate-rise">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage Rasna Mix magic.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg border border-destructive/30">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="admin@rasnamix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background font-semibold py-3 px-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lift active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
