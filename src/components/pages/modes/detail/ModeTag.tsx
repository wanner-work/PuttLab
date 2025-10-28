import clsx from 'clsx'
import { motion } from 'motion/react'
import type { ComponentProps } from 'react'

interface Props extends ComponentProps<typeof motion.div> {
  mode: string
}

export default function ModeTag({
  mode,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <motion.div
      className={clsx(
        'inline-block rounded-lg bg-[#363094]/20 px-2 py-1 font-mono text-xs font-bold text-[#363094] uppercase',
        className
      )}
      {...props}
    >
      {mode}
    </motion.div>
  )
}
