import usePlatform from '@/hooks/capacitor/usePlatform'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useMemo, type HTMLAttributes, type PropsWithChildren } from 'react'

interface Props
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | 'title'
    | 'onDrag'
    | 'onDragStart'
    | 'onDragEnd'
    | 'onAnimationStart'
    | 'onAnimationEnd'
  > {
  /**
   * Defines the row structure of the content area.
   * If there are multiple rows present, pass an array defining each row's height.
   */
  rows?: string[]
}

export default function Layout({
  rows,
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  const platform = usePlatform()

  const containerClassName = useMemo(() => {
    let className = 'grid p-6 h-dvh'

    if (platform === 'ios') {
      // on iOS, we need to add some padding to avoid the notch
      className = clsx(className, 'pt-14')
    }

    return className
  }, [platform])

  return (
    <div className="[view-transition-name:main-content]">
      <motion.div
        className={clsx(containerClassName, className)}
        {...props}
        style={{
          gridTemplateRows: `${rows ? rows.map((row) => `minmax(0, ${row})`).join(' ') : 'minmax(0, 1fr)'}`
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
