import { createRootRoute, Outlet } from '@tanstack/react-router'
import { memo } from 'react'

function RootLayout() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-sans">
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({ component: memo(RootLayout) })
