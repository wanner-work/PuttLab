import { useSwipe } from '@/hooks/ui/useSwipe'
import { type ToPathOption, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { type PropsWithChildren, useMemo, useRef } from 'react'

interface Props {
  backTo?: ToPathOption
  forwardTo?: ToPathOption
  className?: string
}

export default function Swipe({
  backTo,
  forwardTo,
  children,
  className
}: PropsWithChildren<Props>) {
  const navigate = useNavigate()

  const container = useRef<HTMLDivElement>(null)

  const distanceBack = useSwipe(
    container,
    backTo !== undefined,
    () => {
      if (backTo) {
        const search = {} as Record<string, string | boolean>

        if (backTo === '/') {
          search.internal = true
        }

        void navigate({
          to: backTo,
          search,
          viewTransition: { types: ['slide-right'] }
        })
      }
    },
    40
  )

  const distanceForward = useSwipe(
    container,
    forwardTo !== undefined,
    () => {
      if (forwardTo) {
        const search = {} as Record<string, string | boolean>

        if (forwardTo === '/') {
          search.internal = true
        }

        void navigate({
          to: forwardTo,
          search,
          viewTransition: { types: ['slide-left'] }
        })
      }
    },
    -40
  )

  const translateX = useMemo(() => {
    if (!backTo && !forwardTo) {
      return 0
    }

    if ((backTo && distanceBack <= 0) || (forwardTo && distanceForward >= 0)) {
      return 0
    }

    let threshold: number

    if (backTo) {
      threshold = 40
    } else {
      threshold = -40
    }

    if (backTo && distanceBack <= threshold) {
      return distanceBack
    }

    if (forwardTo && distanceForward >= threshold) {
      return distanceForward
    }

    if (backTo) {
      const extra = distanceBack - threshold
      // tweak 5 for stiffness
      return threshold + Math.sqrt(extra) * 7
    }

    if (forwardTo) {
      const extra = distanceForward - threshold
      // tweak 5 for stiffness
      return threshold + Math.sqrt(-extra) * -7
    }

    return 0
  }, [distanceBack, distanceForward])

  return (
    <motion.div
      ref={container}
      className={clsx('h-full', className)}
      animate={{
        translateX
      }}
      transition={{
        duration: translateX === 0 ? 0.1 : 0,
        ease: 'linear'
      }}
    >
      {children}
    </motion.div>
  )
}
