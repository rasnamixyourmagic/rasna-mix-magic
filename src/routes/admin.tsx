import * as React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="admin-wrapper">
      <Outlet />
    </div>
  )
}
