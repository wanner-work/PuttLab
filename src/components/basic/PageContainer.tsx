import PageHeading from '@/components/basic/PageHeading.tsx'
import { Capacitor } from '@capacitor/core'
import { type ClassValue, clsx } from 'clsx'
import { type HTMLAttributes, type PropsWithChildren } from 'react'

interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'className'> {
  title?: string
  subtitle?: string
  className?: ClassValue
}

export default function PageContainer({
  title,
  subtitle,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        'p-6',
        Capacitor.getPlatform() === 'ios' && 'pt-14',
        className
      )}
      {...props}
    >
      {title && <PageHeading title={title} subtitle={subtitle} />}
      {children}
    </div>
  )
}
