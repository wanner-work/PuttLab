import type GridProps from '@/interfaces/ui/layout/GridProps'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { type PropsWithChildren, useMemo } from 'react'

export default function Grid({
  rows,
  className,
  children,
  ...props
}: Readonly<PropsWithChildren<GridProps>>) {
  const gridTemplateRows = useMemo(() => {
    if (!rows) {
      return 'minmax(0, 1fr)'
    }
    return rows.map((row) => `minmax(0, ${row})`).join(' ')
  }, [rows])

  return (
    <motion.div
      className={clsx('grid h-full grid-cols-1', className)}
      {...props}
      style={{
        gridTemplateRows
      }}
    >
      {children}
    </motion.div>
  )
}
