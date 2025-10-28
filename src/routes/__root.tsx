import Screen from '@/components/common/layout/Screen.tsx'
import { Button } from '@/components/ui/button.tsx'
import usePlatform from '@/hooks/capacitor/usePlatform'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import clsx from 'clsx'
import { CircleOff, FrownIcon, MoveLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'

export const Route = createRootRoute({
  component: memo(RootLayout),
  notFoundComponent: NotFound,
  errorComponent: Fail
})

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

function NotFound() {
  return (
    <Screen className="items-center justify-center">
      <div className="text-center">
        <CircleOff className="mx-auto mb-6 size-10 text-neutral-400" />
        <p className="mb-16 text-lg text-neutral-400">
          Genuinely,<span className="italic"> how on earth</span>
          <br />
          did you get here?
        </p>
        <Link
          to="/"
          search={{
            internal: true
          }}
          viewTransition={{ types: ['slide-right'] }}
        >
          <Button>
            <MoveLeft />
            Take me back
          </Button>
        </Link>
        <a
          className="mt-2 flex justify-center gap-2 text-center font-light text-neutral-400 italic underline"
          href="https://github.com/wanner-work/PuttLab/issues/new?template=bug_report.md"
          target="_blank"
        >
          <span>or report a bug</span>
        </a>
      </div>
    </Screen>
  )
}

function Fail() {
  return (
    <Screen className="items-center justify-center">
      <div className="text-center">
        <FrownIcon className="mx-auto mb-6 size-10 text-neutral-400" />
        <p className="mb-16 text-lg text-neutral-400">
          Oh no, something went
          <br /> <span className="italic"> terribly </span>
          wrong
        </p>
        <Link
          to="/"
          search={{
            internal: true
          }}
          viewTransition={{ types: ['slide-right'] }}
        >
          <Button>
            <MoveLeft />
            Take me back
          </Button>
        </Link>
        <a
          className="mt-2 flex justify-center gap-2 text-center font-light text-neutral-400 italic underline"
          href="https://github.com/wanner-work/PuttLab/issues/new?template=bug_report.md"
          target="_blank"
        >
          <span>or report a bug</span>
        </a>
      </div>
    </Screen>
  )
}
