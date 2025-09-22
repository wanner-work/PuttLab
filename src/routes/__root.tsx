import { createRootRoute, Outlet } from '@tanstack/react-router'

function RootLayout() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-sans">
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
