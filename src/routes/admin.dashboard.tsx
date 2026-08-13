import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LogOut, LayoutDashboard, Settings, Users, Package, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

type Recipe = {
  _id: string
  name: string
  email: string
  title: string
  description: string
  videoName: string
  status: 'Pending' | 'Active' | 'Rejected'
  createdAt: string
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Client-side auth guard
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      navigate({ to: '/admin/login' })
      return
    }
    fetchRecipes()
  }, [navigate])

  const fetchRecipes = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recipes')
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setRecipes(data)
    } catch {
      setError('Could not load recipes. Check that MONGODB_URI is set in Vercel environment variables.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate({ to: '/admin/login' })
  }

  const pending = recipes.filter(r => r.status === 'Pending').length
  const active = recipes.filter(r => r.status === 'Active').length

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-border md:min-h-screen flex flex-col z-10">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            <h2 className="text-2xl font-display font-bold text-juice">Rasna Admin</h2>
          </div>
          <p className="text-xs text-muted-foreground pl-5">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Package size={20} />} label="Recipes" />
          <NavItem icon={<Users size={20} />} label="Users" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 animate-rise">

          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-foreground">Overview</h1>
              <p className="text-muted-foreground mt-1">Manage user uploaded Rasna Mix creations.</p>
            </div>
            <button
              onClick={fetchRecipes}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium self-start"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Recipes" value={recipes.length.toString()} trend="All time" icon={<Package size={22} />} />
            <StatCard title="Pending Review" value={pending.toString()} trend="Awaiting approval" icon={<Clock size={22} />} alert={pending > 0} />
            <StatCard title="Approved" value={active.toString()} trend="Live recipes" icon={<CheckCircle size={22} />} />
            <StatCard title="Active Users" value="--" trend="Coming soon" icon={<Users size={22} />} />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-4 rounded-xl flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Recipes Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-display font-bold text-xl">Recent Uploads</h3>
              <span className="text-sm text-muted-foreground">{recipes.length} total</span>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                  <RefreshCw size={32} className="animate-spin opacity-40" />
                  <span>Loading recipes from database…</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground text-sm">
                      <th className="p-4 font-medium">Recipe Title</th>
                      <th className="p-4 font-medium">Submitted By</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recipes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-3">
                            <Package size={40} className="opacity-30" />
                            <span>No recipes uploaded yet. They'll appear here once users start submitting!</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recipes.map((recipe) => (
                        <tr key={recipe._id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-medium text-foreground max-w-[200px] truncate">{recipe.title}</td>
                          <td className="p-4 text-sm text-muted-foreground">{recipe.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{recipe.email}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(recipe.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={recipe.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.Pending}`}>
      {status}
    </span>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  )
}

function StatCard({ title, value, trend, alert = false, icon }: { title: string; value: string; trend: string; alert?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm card-hover">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-muted-foreground text-sm font-medium">{title}</h4>
        {icon && <span className={alert ? 'text-destructive' : 'text-primary'}>{icon}</span>}
      </div>
      <div className="text-3xl font-display font-bold text-foreground mb-1">{value}</div>
      <div className={`text-xs font-medium ${alert ? 'text-destructive' : 'text-primary'}`}>
        {trend}
      </div>
    </div>
  )
}
