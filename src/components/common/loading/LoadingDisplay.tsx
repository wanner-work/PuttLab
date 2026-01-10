import { Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'

interface Props {
  onMount?: () => void
}

/**
 * A loading display component that shows a loading animation.
 * This component is best placed inside a AnimatePresence mode wait component.
 * @returns A motion.div element with a loading message.
 */
export default function LoadingDisplay({ onMount }: Props) {
  useEffect(() => {
    if (onMount) onMount()
  }, [onMount])

  return (
    <motion.div
      key="loading-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full items-center justify-center"
    >
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </motion.div>
  )
}
