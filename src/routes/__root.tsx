import usePlatform from '@/hooks/capacitor/usePlatform'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'

function RootLayout() {
  const platform = usePlatform()

  const layoutClassName = useMemo(() => {
    let className = 'h-full font-sans overflow-hidden'

    if (platform === 'web') {
      // on web, we want to mimic the app appearance
      className = clsx(
        className,
        'rounded-[38px] max-w-[390px] w-dvw h-dvh mx-auto'
      )
    }

    return className
  }, [platform])

  return (
    <div className={layoutClassName}>
      <motion.div
        initial={{
          background:
            'linear-gradient(-30deg, #36309400 0%, #1D177500 0%, #00000000 0%)'
        }}
        animate={{
          background:
            'linear-gradient(-30deg, #363094FF 0%, #1D1775FF 15%, #000000FF 55%)'
        }}
        transition={{
          duration: 2.2,
          ease: 'easeInOut'
        }}
        className="h-full"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}

export const Route = createRootRoute({ component: memo(RootLayout) })
