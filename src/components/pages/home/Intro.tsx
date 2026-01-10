import { motion } from 'motion/react'
import { useCallback, useMemo } from 'react'

interface Props {
  animate?: boolean
}

export default function Intro({ animate = true }: Props) {
  const duration = useMemo(() => (animate ? 0.3 : 0), [animate])
  const delay = useCallback((delay: number) => (animate ? delay : 0), [animate])

  return (
    <motion.div className="self-center">
      <h1 className="text-[38px] leading-[50px] select-none">
        <motion.span
          className="mr-2 inline-block"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration }}
        >
          Step
        </motion.span>
        <motion.span
          className="mr-2 inline-block"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: delay(0.2), duration }}
        >
          right
        </motion.span>
        <motion.span
          className="mr-2 inline-block font-bold"
          initial={{ opacity: 0, scale: 1.4, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: delay(0.5), duration }}
        >
          back
        </motion.span>
        <br />
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: delay(0.9), duration }}
        >
          in
        </motion.span>
        <motion.span
          className="mr-2 inline-block"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: delay(1), duration }}
        >
          to
        </motion.span>
        <motion.span
          className="mr-2 inline-block"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: delay(1.2), duration }}
        >
          the
        </motion.span>
        <motion.span
          className="mr-2 inline-block font-bold"
          initial={{ opacity: 0, scale: 1.4, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: delay(1.5), duration }}
        >
          action
        </motion.span>
      </h1>
    </motion.div>
  )
}
