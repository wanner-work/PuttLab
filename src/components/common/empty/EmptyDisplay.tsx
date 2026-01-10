import clsx from 'clsx'
import { Stars } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
  message?: string
  className?: string
}

/**
 * A empty display component.
 * This component is best placed inside a AnimatePresence mode wait component.
 * @returns A motion.div element with a empty message.
 */
export default function EmptyDisplay({ message, className }: Props) {
  return (
    <motion.div
      key="empty-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        'text-muted-foreground flex h-full flex-col items-center justify-center p-4',
        className
      )}
    >
      <motion.div
        initial={{ rotate: 10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
      >
        <Stars strokeWidth={1.5} className="mb-4 inline-block size-8" />
      </motion.div>
      <p className="max-w-32 text-center">{message}</p>
    </motion.div>
  )
}
