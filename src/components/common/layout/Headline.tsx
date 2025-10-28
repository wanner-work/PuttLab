import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
}

export default function Headline({
  title,
  subtitle,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <div className={clsx('mt-10 mb-6', className)} {...props}>
      <h1 className="text-4xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1 text-lg">{subtitle}</p>
      )}
    </div>
  )
}
