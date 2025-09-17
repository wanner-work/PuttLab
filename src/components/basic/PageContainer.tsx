import PageHeading from '@/components/basic/PageHeading.tsx'
import { Capacitor } from '@capacitor/core'
import { Link } from '@tanstack/react-router'
import { type ClassValue, clsx } from 'clsx'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'motion/react'
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode
} from 'react'
import Reveal from '../animations/Reveal'
import AnimatedIcon from '../brand/AnimatedIcon'
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
  return (
    <motion.div
      className={clsx(
        'min-h-dvh bg-black p-6 [view-transition-name:main-content]',
        Capacitor.getPlatform() === 'ios' && 'pt-14',
        className
      )}
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr)'
      }}
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
        <div className="flex items-center gap-5">
          {back && (
            <Link
              to={back}
              viewTransition={{ types: ['slide-right'] }}
              search={{ internal: true }}
              className="flex items-center justify-center"
            >
              <Reveal
                duration={0.4}
                className="flex items-center justify-center"
              >
                <Button variant="link" className="!p-0">
                  <ChevronLeft className="text-muted-foreground size-6" />
                </Button>
              </Reveal>
            </Link>
          )}
          <Link
            to="/"
            viewTransition={{ types: ['slide-right'] }}
            search={{ internal: true }}
            className="inline-block"
          >
            <AnimatedIcon
              shouldExit={false}
              duration={0.4}
              className="-ml-[18px]"
            />
          </Link>
        </div>
        <div>{actions}</div>
      </div>

      {title && <PageHeading title={title} subtitle={subtitle} />}
      {children}
      <div className="fixed bottom-0"></div>
    </motion.div>
  )
}
