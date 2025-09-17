import PageHeading from '@/components/basic/PageHeading.tsx'
import { Capacitor } from '@capacitor/core'
import { type ClassValue, clsx } from 'clsx'
import {
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode
} from 'react'

interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'className'> {
  title?: string
  subtitle?: string
  className?: ClassValue
  actions?: ReactNode
}

export default function PageContainer({
  title,
  subtitle,
  children,
  actions,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        'h-dvh bg-black p-6',
        Capacitor.getPlatform() === 'ios' && 'pt-14',
        className
      )}
      {...props}
    >
      {actions}
      {title && <PageHeading title={title} subtitle={subtitle} />}
      {children}
      <div className="fixed bottom-0"></div>
    </div>
  )
}
