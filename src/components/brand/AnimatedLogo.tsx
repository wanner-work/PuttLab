import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import Logo from './Logo'

interface Props {
  shouldExit?: boolean
}

export default function AnimatedLogo({ shouldExit = true }: Props) {
  const [exit, setExit] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setExit(shouldExit)
    }, 2800)
  }, [shouldExit])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
      initial={{
        opacity: 0,
        scale: 0.8,
        rotate: -4,
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
      }}
      animate={{
        opacity: exit ? 0 : 1,
        scale: exit ? 0.8 : 1,
        rotate: 0,
        clipPath: exit
          ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
          : 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)'
      }}
      transition={{
        duration: exit ? 0.6 : 2.1,
        ease: 'easeInOut'
      }}
    >
      <Logo className="mx-auto h-10 max-w-full" />
    </motion.div>
  )
}
