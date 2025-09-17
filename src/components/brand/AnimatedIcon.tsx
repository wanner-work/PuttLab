import clsx from 'clsx'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import Icon from './Icon'

interface Props {
  shouldExit?: boolean
  className?: string
  delay?: number
}

export default function AnimatedIcon({
  shouldExit = true,
  className,
  delay
}: Props) {
  const [exit, setExit] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setExit(shouldExit)
    }, 2800)
  }, [shouldExit])

  return (
    <motion.div
      className={clsx('flex', className)}
      initial={{
        opacity: 0,
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
      }}
      animate={{
        opacity: exit ? 0 : 1,
        clipPath: exit
          ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
          : 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)'
      }}
      transition={{
        duration: exit ? 0.6 : 1,
        ease: 'easeInOut',
        delay: delay ?? 0
      }}
    >
      <Icon className="h-8 w-auto" />
    </motion.div>
  )
}
