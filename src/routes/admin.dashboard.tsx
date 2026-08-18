import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Users, 
  Package, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Play, 
  Pause, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  X, 
  Sliders, 
  FileText, 
  ChevronRight, 
  UserMinus, 
  UserCheck, 
  Key, 
  Video, 
  Calendar,
  Mail,
  User,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'

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

type GlobalSettings = {
  autoApprove: boolean
  maintenanceMode: boolean
  maxVideoSize: number
  allowedFormats: string[]
  flaggedEmails: string[]
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'users' | 'settings'>('overview')
  
  // Recipe filters and searching
  const [recipeSearch, setRecipeSearch] = useState('')
  const [recipeStatusFilter, setRecipeStatusFilter] = useState<'All' | 'Pending' | 'Active' | 'Rejected'>('All')
  const [recipeSort, setRecipeSort] = useState<'newest' | 'oldest' | 'title'>('newest')
  
  // Selected recipe for detailed modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', title: '', description: '', status: 'Pending' as Recipe['status'] })

  // User search
  const [userSearch, setUserSearch] = useState('')

  // System Settings state
  const [settings, setSettings] = useState<GlobalSettings>({
    autoApprove: false,
    maintenanceMode: false,
    maxVideoSize: 50,
    allowedFormats: ['.mp4', '.mov', '.avi'],
    flaggedEmails: []
  })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [newFlaggedEmail, setNewFlaggedEmail] = useState('')

  // Admin Account Settings
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Chart SSR rendering guard
  const [isMounted, setIsMounted] = useState(false)

  // Simulated video player playing state (for custom media player wow factor)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Auth check & initial fetches
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth')
    if (!isAuth) {
      navigate({ to: '/admin/login' })
      return
    }
    
    // Load admin profile credentials from localStorage or set defaults
    setAdminEmail(localStorage.getItem('admin_email') || 'admin@rasnamix.com')
    setAdminPassword(localStorage.getItem('admin_password') || 'admin123')

    fetchRecipes()
    fetchSettings()
    setIsMounted(true)
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
      setError('Could not load recipes from database. Verify database configuration.')
      toast.error('Failed to load recipes')
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      toast.error('Failed to load system settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  const updateSetting = async (key: keyof GlobalSettings, value: any) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      })
      if (res.ok) {
        setSettings(prev => ({ ...prev, [key]: value }))
        toast.success(`Setting '${key}' updated successfully`)
      } else {
        throw new Error('Failed to update')
      }
    } catch {
      toast.error('Could not save setting to database')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    toast.success('Logged out successfully')
    navigate({ to: '/admin/login' })
  }

  // Update recipe status quickly (Approve/Reject)
  const handleUpdateStatus = async (recipe: Recipe, newStatus: Recipe['status']) => {
    try {
      const res = await fetch('/api/recipes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: recipe._id, status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update')
      const updated = await res.json()
      
      setRecipes(prev => prev.map(r => r._id === recipe._id ? updated : r))
      
      // Update selected recipe if currently open
      if (selectedRecipe?._id === recipe._id) {
        setSelectedRecipe(updated)
      }

      toast.success(`Recipe marked as ${newStatus}`)
    } catch {
      toast.error('Failed to update recipe status')
    }
  }

  // Save full recipe edits
  const handleSaveRecipeEdits = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipe) return

    try {
      const res = await fetch('/api/recipes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: selectedRecipe._id,
          name: editForm.name,
          email: editForm.email,
          title: editForm.title,
          description: editForm.description,
          status: editForm.status
        })
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()

      setRecipes(prev => prev.map(r => r._id === selectedRecipe._id ? updated : r))
      setSelectedRecipe(updated)
      setIsEditingRecipe(false)
      toast.success('Recipe updated successfully')
    } catch {
      toast.error('Failed to save changes')
    }
  }

  // Delete recipe
  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this recipe submission?')) return

    try {
      const res = await fetch(`/api/recipes?id=${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Delete failed')
      
      setRecipes(prev => prev.filter(r => r._id !== id))
      setSelectedRecipe(null)
      toast.success('Recipe deleted successfully')
    } catch {
      toast.error('Failed to delete recipe')
    }
  }

  // Save new credentials
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('admin_email', adminEmail)
    localStorage.setItem('admin_password', adminPassword)
    toast.success('Admin credentials updated! Use these on next sign-in.')
  }

  // Add a flagged user email
  const handleAddFlaggedEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailToFlag = newFlaggedEmail.toLowerCase().trim()
    if (!emailToFlag) return
    if (settings.flaggedEmails.includes(emailToFlag)) {
      toast.warning('Email is already flagged')
      return
    }

    const updatedEmails = [...settings.flaggedEmails, emailToFlag]
    await updateSetting('flaggedEmails', updatedEmails)
    setNewFlaggedEmail('')
  }

  // Remove flagged email
  const handleRemoveFlaggedEmail = async (emailToRemove: string) => {
    const updatedEmails = settings.flaggedEmails.filter(email => email !== emailToRemove)
    await updateSetting('flaggedEmails', updatedEmails)
  }

  // Open recipe details & load edit form
  const handleOpenDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setEditForm({
      name: recipe.name,
      email: recipe.email,
      title: recipe.title,
      description: recipe.description,
      status: recipe.status
    })
    setIsEditingRecipe(false)
    setIsVideoPlaying(false)
  }

  // Filtered and Sorted recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(recipe => {
        const matchesSearch = 
          recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
          recipe.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
          recipe.email.toLowerCase().includes(recipeSearch.toLowerCase())
        
        const matchesStatus = recipeStatusFilter === 'All' || recipe.status === recipeStatusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (recipeSort === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (recipeSort === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        if (recipeSort === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [recipes, recipeSearch, recipeStatusFilter, recipeSort])

  // Aggregate user statistics
  const usersList = useMemo(() => {
    const usersMap = new Map<string, { 
      name: string
      email: string
      total: number
      approved: number
      pending: number
      rejected: number
      lastActive: string
    }>()

    recipes.forEach(recipe => {
      const emailKey = recipe.email.toLowerCase().trim()
      const current = usersMap.get(emailKey) || {
        name: recipe.name,
        email: recipe.email,
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        lastActive: recipe.createdAt
      }

      current.total += 1
      if (recipe.status === 'Active') current.approved += 1
      else if (recipe.status === 'Rejected') current.rejected += 1
      else current.pending += 1

      if (new Date(recipe.createdAt).getTime() > new Date(current.lastActive).getTime()) {
        current.lastActive = recipe.createdAt
      }

      usersMap.set(emailKey, current)
    })

    return Array.from(usersMap.values()).filter(user => {
      return (
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    })
  }, [recipes, userSearch])

  // Overview calculations
  const totalCount = recipes.length
  const pendingCount = recipes.filter(r => r.status === 'Pending').length
  const activeCount = recipes.filter(r => r.status === 'Active').length
  const rejectedCount = recipes.filter(r => r.status === 'Rejected').length
  const uniqueUsersCount = useMemo(() => new Set(recipes.map(r => r.email.toLowerCase().trim())).size, [recipes])

  // Submissions chart data (last 7 days grouped)
  const submissionsChartData = useMemo(() => {
    const groups: Record<string, number> = {}
    
    // Seed last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      groups[dateStr] = 0
    }

    recipes.forEach(r => {
      const dateStr = new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      if (groups[dateStr] !== undefined) {
        groups[dateStr] += 1
      }
    })

    return Object.entries(groups).map(([date, count]) => ({ date, count }))
  }, [recipes])

  // Status distribution chart data
  const statusChartData = useMemo(() => {
    return [
      { name: 'Pending', value: pendingCount, color: '#f59e0b' },
      { name: 'Approved', value: activeCount, color: '#10b981' },
      { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
    ].filter(d => d.value > 0)
  }, [pendingCount, activeCount, rejectedCount])

  // Navigation Items Renderer
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'recipes', label: 'Recipes', icon: <Package size={20} />, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-border md:min-h-screen flex flex-col z-10 shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3.5 h-3.5 rounded-full bg-primary inline-block shadow-juice" />
            <h2 className="text-2xl font-display font-bold text-juice">Rasna Admin</h2>
          </div>
          <p className="text-xs text-muted-foreground pl-5.5">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all font-medium text-left ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-juice'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === item.id ? 'bg-primary-foreground text-primary' : 'bg-amber-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
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

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <div className="max-w-6xl mx-auto space-y-8 animate-rise">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-extrabold text-foreground capitalize">
                {activeTab === 'overview' ? 'Overview' : `${activeTab} Management`}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeTab === 'overview' && 'Configure settings, review uploads, and analyze user submission patterns.'}
                {activeTab === 'recipes' && 'Browse, audit, approve, edit, or reject submitted Rasna Mix creations.'}
                {activeTab === 'users' && 'Manage content creators, view user metrics, or block spam accounts.'}
                {activeTab === 'settings' && 'Update admin portal passwords and control global site upload configurations.'}
              </p>
            </div>
            
            {activeTab === 'overview' && (
              <button
                onClick={fetchRecipes}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted/50 transition-all text-sm font-medium self-start shadow-sm hover:scale-102"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin text-primary' : ''} />
                Refresh Data
              </button>
            )}
          </header>

          {/* Error Banner */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-4 rounded-2xl flex items-start gap-3 shadow-sm">
              <XCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Submissions" value={totalCount.toString()} trend="All time uploaded" icon={<Package size={22} />} />
                <StatCard title="Awaiting Review" value={pendingCount.toString()} trend="Needs attention" icon={<Clock size={22} />} alert={pendingCount > 0} />
                <StatCard title="Approved Mixes" value={activeCount.toString()} trend="Live on community page" icon={<CheckCircle size={22} />} />
                <StatCard title="Rejected Submissions" value={rejectedCount.toString()} trend="Filtered uploads" icon={<XCircle size={22} />} />
                <StatCard title="Active Mixers" value={uniqueUsersCount.toString()} trend="Unique contributors" icon={<Users size={22} />} />
              </div>

              {/* Charts Panel */}
              {isMounted && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Submission Trends Chart */}
                  <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold font-display mb-4">Recipe Submissions (Last 7 Days)</h3>
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={submissionsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="count" name="Submissions" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Distribution Chart */}
                  <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold font-display mb-4">Audit Status Breakdown</h3>
                    <div className="flex-1 h-[200px] flex items-center justify-center relative">
                      {statusChartData.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center">No recipes uploaded yet</div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {statusChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                      
                      {statusChartData.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-display font-extrabold">{totalCount}</span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
                        </div>
                      )}
                    </div>
                    {/* Status Legends */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4">
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-amber-500 mb-1" />
                        <span className="font-semibold text-foreground">{pendingCount} Pending</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 mb-1" />
                        <span className="font-semibold text-foreground">{activeCount} Approved</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mb-1" />
                        <span className="font-semibold text-foreground">{rejectedCount} Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Pending Table */}
              <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="font-display font-bold text-xl">Recent Recipes Awaiting Review</h3>
                  <span className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 font-semibold">{pendingCount} Awaiting review</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Recipe details</th>
                        <th className="p-4 font-bold">Creator</th>
                        <th className="p-4 font-bold">Upload date</th>
                        <th className="p-4 font-bold text-right">Review action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recipes.filter(r => r.status === 'Pending').slice(0, 5).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <CheckCircle size={40} className="text-emerald-500 opacity-60" />
                              <span className="font-semibold text-foreground">Inboxes Cleared!</span>
                              <span className="text-sm">There are no pending submissions awaiting audit. Nice job!</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recipes.filter(r => r.status === 'Pending').slice(0, 5).map((recipe) => (
                          <tr key={recipe._id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-4">
                              <button 
                                onClick={() => handleOpenDetails(recipe)}
                                className="font-semibold text-foreground text-left hover:text-primary transition-colors hover:underline block"
                              >
                                {recipe.title}
                              </button>
                              <span className="text-xs text-muted-foreground line-clamp-1 max-w-sm mt-0.5">{recipe.description}</span>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-sm text-foreground">{recipe.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail size={12} /> {recipe.email}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(recipe.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleUpdateStatus(recipe, 'Active')}
                                  className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 transition-colors"
                                  title="Approve Submission"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(recipe, 'Rejected')}
                                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 transition-colors"
                                  title="Reject Submission"
                                >
                                  <X size={16} />
                                </button>
                                <button
                                  onClick={() => handleOpenDetails(recipe)}
                                  className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                                  title="Audit / Details"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECIPES MANAGEMENT */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              {/* Filter controls panel */}
              <div className="glass-panel p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by title, name, email..."
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                  />
                  {recipeSearch && (
                    <button 
                      onClick={() => setRecipeSearch('')} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground font-bold text-xs"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  {/* Status tabs */}
                  <div className="flex bg-muted/60 p-1 rounded-xl border border-border text-sm">
                    {(['All', 'Pending', 'Active', 'Rejected'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setRecipeStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                          recipeStatusFilter === status
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2 border border-border rounded-xl p-2 bg-card text-sm text-muted-foreground">
                    <Sliders size={15} />
                    <select
                      value={recipeSort}
                      onChange={(e: any) => setRecipeSort(e.target.value)}
                      className="bg-transparent border-none outline-none text-foreground font-medium cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recipe List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                    <RefreshCw size={40} className="animate-spin opacity-40 text-primary" />
                    <span className="font-medium text-foreground">Loading recipes...</span>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border flex flex-col items-center gap-4">
                    <Package size={44} className="opacity-45" />
                    <div>
                      <h4 className="text-lg font-bold font-display text-foreground">No matches found</h4>
                      <p className="text-sm max-w-sm mt-1 mx-auto">Try refining your search parameters, resetting status filters, or check connection.</p>
                    </div>
                    {(recipeSearch || recipeStatusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setRecipeSearch('')
                          setRecipeStatusFilter('All')
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:scale-103 transition-transform"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredRecipes.map(recipe => (
                    <div
                      key={recipe._id}
                      onClick={() => handleOpenDetails(recipe)}
                      className="glass-panel p-5 rounded-2xl border border-border shadow-sm flex flex-col hover:border-primary/40 hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <StatusBadge status={recipe.status} />
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(recipe.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <h4 className="font-display font-extrabold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-1.5 flex-grow">
                        {recipe.description}
                      </p>

                      <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground line-clamp-1">{recipe.name}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">{recipe.email}</span>
                        </div>
                        <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Audit <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search user */}
              <div className="glass-panel p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search mixers by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                  />
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {usersList.length} unique creators
                </div>
              </div>

              {/* Users Table */}
              <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Mixer details</th>
                        <th className="p-4 font-bold text-center">Approved</th>
                        <th className="p-4 font-bold text-center">Pending</th>
                        <th className="p-4 font-bold text-center">Rejected</th>
                        <th className="p-4 font-bold text-center">Total Submitted</th>
                        <th className="p-4 font-bold">Last Activity</th>
                        <th className="p-4 font-bold text-right">Creator Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <RefreshCw size={32} className="animate-spin text-primary opacity-50" />
                              <span>Loading mixers statistics...</span>
                            </div>
                          </td>
                        </tr>
                      ) : usersList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <Users size={40} className="opacity-35" />
                              <span className="font-semibold text-foreground">No creators found</span>
                              <span>No submitters found matching your search.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        usersList.map((user) => {
                          const isFlagged = settings.flaggedEmails.includes(user.email.toLowerCase().trim())
                          return (
                            <tr key={user.email} className={`hover:bg-muted/20 transition-colors ${isFlagged ? 'bg-red-500/5 hover:bg-red-500/10' : ''}`}>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                                    {user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                                      {user.name}
                                      {isFlagged && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center gap-0.5 border border-red-200">
                                          <ShieldAlert size={10} /> Flagged
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Mail size={11} /> {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-center font-bold text-sm text-emerald-600 dark:text-emerald-400">
                                {user.approved}
                              </td>
                              <td className="p-4 text-center font-bold text-sm text-amber-500">
                                {user.pending}
                              </td>
                              <td className="p-4 text-center font-bold text-sm text-red-500">
                                {user.rejected}
                              </td>
                              <td className="p-4 text-center font-bold text-sm text-foreground">
                                {user.total}
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {new Date(user.lastActive).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setRecipeSearch(user.email)
                                      setRecipeStatusFilter('All')
                                      setActiveTab('recipes')
                                      toast.info(`Filtering submissions by ${user.email}`)
                                    }}
                                    className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold hover:scale-102 transition-transform text-foreground"
                                    title="View Mixes"
                                  >
                                    View Mixes
                                  </button>
                                  
                                  {isFlagged ? (
                                    <button
                                      onClick={() => handleRemoveFlaggedEmail(user.email)}
                                      className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:scale-105 transition-transform"
                                      title="Unflag User (Allows Submissions)"
                                    >
                                      <UserCheck size={16} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Flag user '${user.name}'? Submissions from this email will automatically be rejected.`)) {
                                          const updatedEmails = [...settings.flaggedEmails, user.email.toLowerCase().trim()]
                                          updateSetting('flaggedEmails', updatedEmails)
                                        }
                                      }}
                                      className="p-1.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 hover:scale-105 transition-transform"
                                      title="Flag User (Auto-Reject Submissions)"
                                    >
                                      <UserMinus size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Settings Form */}
              <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Key className="text-primary" size={22} />
                  <h3 className="text-xl font-bold font-display text-foreground">Admin Credentials</h3>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="profile-email">
                      Admin Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="profile-password">
                      Admin Password
                    </label>
                    <input
                      id="profile-password"
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform text-sm shadow-md"
                  >
                    Save Login Details
                  </button>
                </form>
              </div>

              {/* Portal System Configuration */}
              <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Sliders className="text-primary" size={22} />
                  <h3 className="text-xl font-bold font-display text-foreground">Portal Settings</h3>
                </div>

                {settingsLoading ? (
                  <div className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <RefreshCw size={24} className="animate-spin text-primary" />
                    <span>Loading settings...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Auto approve setting */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-bold text-foreground">Auto-Approve Recipes</label>
                        <p className="text-xs text-muted-foreground max-w-[240px]">
                          Automatically approve new user uploads immediately without manual review.
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('autoApprove', !settings.autoApprove)}
                        className={`w-12 h-6 rounded-full p-1 transition-all ${
                          settings.autoApprove ? 'bg-primary flex justify-end' : 'bg-muted flex justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-card shadow-sm inline-block" />
                      </button>
                    </div>

                    {/* Maintenance mode */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-bold text-foreground">Maintenance Mode</label>
                        <p className="text-xs text-muted-foreground max-w-[240px]">
                          Temorarily freeze public recipe uploads. Upload screen will display warning.
                        </p>
                      </div>
                      <button
                        onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                        className={`w-12 h-6 rounded-full p-1 transition-all ${
                          settings.maintenanceMode ? 'bg-red-500 flex justify-end' : 'bg-muted flex justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-card shadow-sm inline-block" />
                      </button>
                    </div>

                    {/* Max Video Size Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Max Video Size limit (MB)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={settings.maxVideoSize}
                          onChange={(e) => setSettings(prev => ({ ...prev, maxVideoSize: parseInt(e.target.value) || 50 }))}
                          className="w-24 bg-background/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button
                          onClick={() => updateSetting('maxVideoSize', settings.maxVideoSize)}
                          className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:scale-102 active:scale-98 transition-transform"
                        >
                          Update Limit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blocklist / Flagged Emails directory */}
              <div className="col-span-full glass-panel p-6 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <ShieldAlert className="text-red-500" size={22} />
                  <h3 className="text-xl font-bold font-display text-foreground">Uploader Blocklist (Auto-Reject List)</h3>
                </div>

                <form onSubmit={handleAddFlaggedEmail} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address to block..."
                    value={newFlaggedEmail}
                    onChange={(e) => setNewFlaggedEmail(e.target.value)}
                    className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:scale-102 transition-transform shadow-md"
                  >
                    <Plus size={14} /> Add Blocked
                  </button>
                </form>

                <div className="space-y-2 mt-4">
                  <label className="text-sm font-semibold text-muted-foreground block">Blocked Email Addresses ({settings.flaggedEmails.length})</label>
                  {settings.flaggedEmails.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No emails flagged. Submissions are open to all accounts.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {settings.flaggedEmails.map(email => (
                        <div key={email} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 text-xs font-medium">
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFlaggedEmail(email)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold ml-1 rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900"
                            title="Unblock Email"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* DETAIL MODAL PANEL (SLIDE-OVER / LIGHTBOX DETAILED PANEL) */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="glass-panel w-full max-w-4xl rounded-[2.5rem] border border-border shadow-lift overflow-hidden bg-card/95 max-h-[90vh] flex flex-col animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground bg-primary px-2.5 py-1 rounded-full shadow-juice">
                  RECIPE AUDIT BOARD
                </span>
                <h3 className="text-2xl font-display font-extrabold text-foreground mt-2">
                  {isEditingRecipe ? 'Edit Recipe Submission' : selectedRecipe.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedRecipe(null)
                  setIsEditingRecipe(false)
                }}
                className="w-10 h-10 rounded-full border border-border hover:bg-muted flex items-center justify-center text-foreground hover:scale-105 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {isEditingRecipe ? (
                /* Edit Recipe Form */
                <form onSubmit={handleSaveRecipeEdits} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Recipe Title</label>
                      <input
                        type="text"
                        required
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Audit Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e: any) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all text-foreground cursor-pointer font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active (Approved)</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Uploader Name</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Uploader Email</label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Ingredients & Steps (Description)</label>
                    <textarea
                      rows={5}
                      required
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end border-t border-border pt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditingRecipe(false)}
                      className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-xs uppercase tracking-wide transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wide rounded-xl hover:scale-102 transition-transform shadow-juice"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* Recipe Inspection View */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left side: Premium media player mock */}
                  <div className="md:col-span-5 space-y-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Recipe Video Attachment</span>
                    <div className="relative aspect-[9/16] bg-neutral-900 rounded-[2rem] overflow-hidden group shadow-lift border border-neutral-800 flex flex-col justify-center items-center">
                      
                      {isVideoPlaying ? (
                        <>
                          {/* Playing State Mock Animation */}
                          <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 text-white bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold self-start flex items-center gap-1 uppercase">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" /> Live Preview
                            </span>
                            
                            {/* Animated Audio Equalizer Visualizer simulation */}
                            <div className="flex justify-center items-end gap-1 h-12 w-full mt-auto">
                              {Array.from({ length: 15 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className="w-1 bg-orange-500 rounded-full animate-bounce"
                                  style={{ 
                                    height: `${Math.floor(Math.random() * 80) + 20}%`,
                                    animationDuration: `${Math.floor(Math.random() * 800) + 400}ms`
                                  }} 
                                />
                              ))}
                            </div>
                          </div>

                          <div className="text-center p-6 text-white space-y-3 z-10">
                            <Video size={48} className="mx-auto text-primary animate-pulse" />
                            <h5 className="font-bold text-sm">{selectedRecipe.videoName || 'Attached_Video.mp4'}</h5>
                            <p className="text-xs text-neutral-400">Audio/video stream simulation running...</p>
                          </div>
                        </>
                      ) : (
                        /* Paused State */
                        <div className="absolute inset-0 bg-neutral-950/90 flex flex-col justify-center items-center p-6 text-center z-10">
                          <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="w-20 h-20 rounded-full bg-primary text-primary-foreground shadow-juice flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Play size={32} className="ml-1" fill="currentColor" />
                          </button>
                          <h5 className="font-bold text-sm text-neutral-200 mt-5 truncate max-w-[200px]">
                            {selectedRecipe.videoName || 'Attached_Video.mp4'}
                          </h5>
                          <span className="text-xs text-neutral-400 mt-1">Click to play upload attachment</span>
                        </div>
                      )}

                      {/* Video Player controls footer */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 flex justify-between items-center text-white text-xs">
                        <button 
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)} 
                          className="hover:scale-110 transition-transform"
                        >
                          {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <div className="flex-1 mx-3 h-1 bg-white/20 rounded-full overflow-hidden relative">
                          <div 
                            className={`absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-300 ${isVideoPlaying ? 'w-[60%] animate-pulse' : 'w-[10%]'}`} 
                          />
                        </div>
                        <span>0:14 / 0:30</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Detailed Information */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Uploader Mixer</span>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <User size={14} className="text-primary" />
                          {selectedRecipe.name}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Current Audit Status</span>
                        <div>
                          <StatusBadge status={selectedRecipe.status} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Email Address</span>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <Mail size={14} className="text-primary" />
                          {selectedRecipe.email}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Date Received</span>
                        <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" />
                          {new Date(selectedRecipe.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground uppercase font-bold block">Ingredients & Preparation Instructions</span>
                      <div className="p-4 bg-muted/50 rounded-2xl text-sm border border-border leading-relaxed text-foreground whitespace-pre-wrap">
                        {selectedRecipe.description}
                      </div>
                    </div>

                    {/* Quick review action panel */}
                    {selectedRecipe.status === 'Pending' && (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                          <AlertTriangle size={18} className="shrink-0" />
                          <span className="text-xs font-semibold">This submission requires review before appearing on the public page.</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateStatus(selectedRecipe, 'Active')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-103 transition-transform flex items-center gap-1 shadow-sm"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedRecipe, 'Rejected')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-103 transition-transform flex items-center gap-1 shadow-sm"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Admin management buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border mt-auto">
                      <div className="flex gap-2">
                        {selectedRecipe.status !== 'Active' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedRecipe, 'Active')}
                            className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide rounded-xl transition-all"
                          >
                            Set Approved
                          </button>
                        )}
                        {selectedRecipe.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedRecipe, 'Rejected')}
                            className="px-4 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wide rounded-xl transition-all"
                          >
                            Set Rejected
                          </button>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditingRecipe(true)}
                          className="px-4 py-2.5 border border-border hover:bg-muted font-bold text-xs uppercase tracking-wide rounded-xl flex items-center gap-1 transition-all text-foreground"
                        >
                          <Edit3 size={14} /> Edit Info
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(selectedRecipe._id)}
                          className="px-4 py-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs uppercase tracking-wide rounded-xl flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200',
    Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] ?? styles.Pending}`}>
      {status === 'Active' ? 'Approved' : status}
    </span>
  )
}

function StatCard({ title, value, trend, alert = false, icon }: { title: string; value: string; trend: string; alert?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-border shadow-sm card-hover flex-grow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{title}</h4>
        {icon && <span className={alert ? 'text-amber-500 animate-pulse' : 'text-primary'}>{icon}</span>}
      </div>
      <div className="text-3xl font-display font-extrabold text-foreground mb-1">{value}</div>
      <div className={`text-[10px] font-bold ${alert ? 'text-amber-500' : 'text-muted-foreground'}`}>
        {trend}
      </div>
    </div>
  )
}
