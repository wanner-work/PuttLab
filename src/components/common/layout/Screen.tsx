import type ScreenProps from '@/interfaces/ui/layout/ScreenProps.ts'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { type PropsWithChildren, useMemo } from 'react'

export default function Screen({
  rows,
  className,
  children,
  ...props
}: Readonly<PropsWithChildren<ScreenProps>>) {
  const gridTemplateRows = useMemo(() => {
    if (!rows) {
      return 'minmax(0, 1fr)'
    }
    return rows.map((row) => `minmax(0, ${row})`).join(' ')
  }, [rows])

  return (
    <motion.div
      className={clsx('grid h-full', className)}
      {...props}
      style={{
        gridTemplateRows
      }}
    >
      {children}
    </motion.div>
  )
}
