import Reveal from '@/components/animations/Reveal'
import type ModeStep from '@/interfaces/data/mode/ModeStep'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Props {
  index: number
  step: ModeStep
}

export default function ModeIntroduction({ index, step }: Props) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(false)
    const timeout = setTimeout(() => setActive(false), 1700)
    return () => clearTimeout(timeout)
  }, [index])

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        marginTop: active ? '400px' : '80px'
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div className="text-center">
        <motion.p
          animate={{
            fontSize: active ? '26px' : '16px'
          }}
          className="font-bold text-neutral-400 uppercase"
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Step {index + 1}
        </motion.p>
        <motion.div
          animate={{
            fontSize: active ? '44px' : '28px'
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-mono font-bold uppercase"
        >
          <Reveal>{step.label}</Reveal>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
