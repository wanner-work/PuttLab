import { motion } from 'motion/react'
import type { PropsWithChildren } from 'react'

interface Props {
  delay?: number
  duration?: number
  className?: string
}

export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  className
}: PropsWithChildren<Props>) {
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
      animate={{
        opacity: 1,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
      }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
