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
    <div className={clsx('mt-10 mb-8', className)} {...props}>
      <h1 className="text-center text-4xl font-bold">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mx-auto mt-3 max-w-[200px] text-center text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
