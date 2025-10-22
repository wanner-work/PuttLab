import usePlatform from '@/hooks/capacitor/usePlatform'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

function RootLayout() {
  const platform = usePlatform()

  const layoutClassName = useMemo(() => {
    let className = 'min-h-dvh overflow-x-hidden font-sans'

    if (platform === 'web') {
      // on web, we want to center the content
      className = clsx(className, 'flex items-center justify-center')
    }

    return className
  }, [platform])

  return (
    <div className={layoutClassName}>
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({ component: memo(RootLayout) })
