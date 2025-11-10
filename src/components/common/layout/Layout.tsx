import Screen from '@/components/common/layout/Grid'
import usePlatform from '@/hooks/capacitor/usePlatform'
import type GridProps from '@/interfaces/ui/layout/GridProps'
import type { ToPathOption } from '@tanstack/react-router'
import clsx from 'clsx'
import { useMemo, type PropsWithChildren } from 'react'
import Swipe from './Swipe'

interface Props extends GridProps {
  backTo?: ToPathOption
  forwardTo?: ToPathOption
}

export default function Layout({
  rows,
  backTo,
  forwardTo,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  const platform = usePlatform()

  const containerClassName = useMemo(() => {
    let className = 'grid p-6 h-full'

    if (platform === 'ios') {
      // on iOS, we need to add some padding to avoid the notch
      className = clsx(className, 'pt-14')
    }

    return className
  }, [platform])

  return (
    <div className="relative h-full [view-transition-name:main-content]">
      <Swipe backTo={backTo} forwardTo={forwardTo}>
        <Screen
          rows={rows}
          className={clsx(containerClassName, className)}
          {...props}
        >
          {children}
        </Screen>
      </Swipe>
    </div>
  )
}
