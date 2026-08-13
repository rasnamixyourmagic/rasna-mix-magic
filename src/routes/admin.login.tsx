import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

// Admin credentials — change these to whatever you want
const ADMIN_EMAIL = 'admin@rasnamix.com'
const ADMIN_PASSWORD = 'admin123'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate a short delay for UX
    await new Promise((r) => setTimeout(r, 600))

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      navigate({ to: '/admin/dashboard' })
    } else {
      setError('Invalid email or password. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-sunrise flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-[var(--radius-3xl)] shadow-juice animate-rise">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
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
            <label className="text-sm font-medium text-foreground ml-1" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="admin@rasnamix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground ml-1" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
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
