import * as React from 'react'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

// This layout intentionally renders ONLY the Outlet (no Navbar/Footer)
// so admin pages have their own full-screen layout
function AdminLayout() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--background)' }} className="overflow-auto">
      <Outlet />
    </div>
  )
}
