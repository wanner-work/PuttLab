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
  const modeColorClassName = clsx(
    mode === 'champion' && 'bg-[#363094]/20 text-[#363094] ',
    mode === 'focus' && 'bg-[#946436]/20 text-[#946436] ',
    mode === 'endurance' && 'bg-[#36946A]/20 text-[#36946A] '
  )

  return (
    <motion.div
      className={clsx(
        'inline-block rounded-lg px-2 pt-1 pb-0.5 font-mono text-xs font-bold uppercase',
        modeColorClassName,
        className
      )}
      {...props}
    >
      {mode}
    </motion.div>
  )
}
