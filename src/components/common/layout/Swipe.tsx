import { useSwipe } from '@/hooks/ui/useSwipe'
import { useNavigate, type ToPathOption } from '@tanstack/react-router'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useMemo, useRef, type PropsWithChildren } from 'react'

interface Props {
  backTo?: ToPathOption
  className?: string
}

export default function Swipe({
  backTo,
  children,
  className
}: PropsWithChildren<Props>) {
  const navigate = useNavigate()

  const container = useRef<HTMLDivElement>(null)

  const distance = useSwipe(
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

  const translateX = useMemo(() => {
    if (distance <= 0) return 0

    const threshold = 40

    if (distance <= threshold) {
      return distance
    }

    const extra = distance - threshold
    const elastic = threshold + Math.sqrt(extra) * 7 // tweak 5 for stiffness

    return elastic
  }, [distance])

  return (
    <motion.div
      ref={container}
      className={clsx('h-full', className)}
      animate={{
        translateX: translateX
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
