import Screen from '@/components/common/layout/Screen.tsx'
import usePlatform from '@/hooks/capacitor/usePlatform'
import type ScreenProps from '@/interfaces/ui/layout/ScreenProps.ts'
import clsx from 'clsx'
import { useMemo, type PropsWithChildren } from 'react'

export default function Layout({
  rows,
  children,
  className,
  ...props
}: PropsWithChildren<ScreenProps>) {
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
      <Screen
        rows={rows}
        className={clsx(containerClassName, className)}
        {...props}
      >
        {children}
      </Screen>
    </div>
  )
}
