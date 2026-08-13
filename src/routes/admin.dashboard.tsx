import * as React from 'react'
import { createFileRoute, useNavigate, redirect, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from 'vinxi/http'
import { LogOut, LayoutDashboard, Settings, Users, Package } from 'lucide-react'
import { verifyToken } from '../lib/auth'
import { connectToDatabase } from '../lib/db'
import { Product } from '../lib/models'

export const getDashboardDataFn = createServerFn('GET', async () => {
  const token = getCookie('admin_token')
  if (!token || !verifyToken(token)) {
    throw redirect({ to: '/admin/login' })
  }

  await connectToDatabase()
  const products = await Product.find({}).sort({ createdAt: -1 }).lean()
  
  // Transform to plain objects for hydration
  return JSON.parse(JSON.stringify(products))
})

export const logoutFn = createServerFn('POST', async () => {
  setCookie('admin_token', '', { maxAge: 0, path: '/' })
  return { success: true }
})

export const Route = createFileRoute('/admin/dashboard')({
  loader: () => getDashboardDataFn(),
  component: AdminDashboard,
})

function AdminDashboard() {
  const products = Route.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutFn()
    await router.invalidate()
    navigate({ to: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-border md:h-screen flex flex-col z-10 sticky top-0 md:relative">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-display font-bold text-juice">Rasna Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Package size={20} />} label="Products/Recipes" />
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
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw]">
        <div className="max-w-6xl mx-auto space-y-8 animate-rise">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-foreground">Overview</h1>
              <p className="text-muted-foreground mt-1">Manage user uploaded Rasna Mix creations.</p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Recipes" value={products.length.toString()} trend="All time" />
            <StatCard title="Active Users" value="--" trend="Coming soon" />
            <StatCard title="New Uploads" value={products.filter((p: any) => p.status === 'Pending').length.toString()} trend="Pending Review" alert />
            <StatCard title="Approved" value={products.filter((p: any) => p.status === 'Active').length.toString()} trend="Active recipes" />
          </div>

          {/* Products Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-display font-bold text-xl">Recent Uploads</h3>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-sm">
                    <th className="p-4 font-medium">Recipe Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Uploader</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No recipes uploaded yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((product: any) => (
                      <tr key={product._id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium text-foreground">{product.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{product.category}</td>
                        <td className="p-4 text-sm text-muted-foreground">{product.uploader}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(product.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
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

function StatCard({ title, value, trend, alert = false }: { title: string; value: string; trend: string; alert?: boolean }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-border shadow-sm card-hover">
      <h4 className="text-muted-foreground text-sm font-medium mb-2">{title}</h4>
      <div className="text-3xl font-display font-bold text-foreground mb-1">{value}</div>
      <div className={`text-xs font-medium ${alert ? 'text-destructive' : 'text-primary'}`}>
        {trend}
      </div>
    </div>
  )
}
