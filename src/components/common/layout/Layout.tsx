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
    let className = 'grid p-6'

    if (platform === 'web') {
      // on web, we want to mimic the app appearance
      className = clsx(
        className,
        'max-h-[844px] max-w-[390px] w-dvw h-dvh mx-auto rounded-[38px]'
      )
    } else {
      className = clsx(className, 'h-dvh')
    }

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
        style={{
          gridTemplateRows: `${rows ? rows.map((row) => `minmax(0, ${row})`).join(' ') : 'minmax(0, 1fr)'}`
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
