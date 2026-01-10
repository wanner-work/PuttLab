import Icon from '@/components/brand/Icon'
import { Button } from '@/components/ui/button'
import { Link, type ToPathOption } from '@tanstack/react-router'
import clsx from 'clsx'
import { ChevronLeft } from 'lucide-react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  backTo?: ToPathOption
}

export default function Header({
  backTo,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <header
      className={clsx('flex items-center justify-between', className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {backTo && (
          <Link
            to={backTo}
            viewTransition={{ types: ['slide-right'] }}
            search={{ internal: true }}
            className="-ml-3 flex items-center justify-center p-3"
          >
            <Button
              variant="link"
              className="!p-0 [view-transition-name:back-button]"
            >
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
          <div className="h-10 p-1.5">
            <Icon className="-ml-[22px] h-full w-auto" />
          </div>
        </Link>
      </div>
      {children}
    </header>
  )
}
