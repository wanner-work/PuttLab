import PageHeading from '@/components/basic/PageHeading.tsx'
import { useSwipe } from '@/hooks/ui/useSwipe.ts'
import { Capacitor } from '@capacitor/core'
import { Link, useNavigate } from '@tanstack/react-router'
import { type ClassValue, clsx } from 'clsx'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useRef
} from 'react'
import Icon from '../brand/Icon'
import { Button } from '../ui/button'

interface Props
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'title'
    | 'className'
    | 'onDrag'
    | 'onDragStart'
    | 'onDragEnd'
    | 'onAnimationStart'
    | 'onAnimationEnd'
  > {
  title?: string
  subtitle?: string
  className?: ClassValue
  actions?: ReactNode
  back?: string
}

export default function PageContainer({
  title,
  subtitle,
  back,
  children,
  actions,
  className,
  ...props
}: PropsWithChildren<Props>) {
  const navigate = useNavigate()

  const container = useRef<HTMLDivElement>(null)

  const distance = useSwipe(
    container,
    () => {
      if (back) {
        const search = {} as Record<string, string | boolean>

        if (back === '/') {
          search.internal = true
        }

        void navigate({
          to: back,
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
    <div className="[view-transition-name:main-content]">
      <motion.div
        ref={container}
        className={clsx('min-h-dvh bg-black')}
        animate={{
          translateX: translateX
        }}
        transition={{
          duration: translateX === 0 ? 0.1 : 0,
          ease: 'linear'
        }}
      >
        <motion.div
          className={clsx(
            'min-h-dvh p-6',
            Capacitor.getPlatform() === 'ios' && 'pt-14',
            Capacitor.getPlatform() === 'web' &&
              'mx-auto max-w-[440px] rounded-[38px]',
            className
          )}
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
          {...props}
        >
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {back && (
                <Link
                  to={back}
                  viewTransition={{ types: ['slide-right'] }}
                  search={{ internal: true }}
                  className="-ml-3 flex items-center justify-center p-3"
                >
                  <Button variant="link" className="!p-0">
                    <ChevronLeft className="text-muted-foreground size-6" />
                  </Button>
                </Link>
              )}
              <Link
                to="/"
                viewTransition={{ types: ['slide-right'] }}
                search={{ internal: true }}
                className="inline-block"
              >
                <Icon className="-ml-[18px] h-8 w-auto" />
              </Link>
            </div>
            {actions}
          </div>

          {title && <PageHeading title={title} subtitle={subtitle} />}
          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}
