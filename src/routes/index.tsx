import Logo from '@/components/brand/Logo'
import { createFileRoute } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  const [exit, setExit] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setExit(true)
    }, 3000)
  }, [])

  return (
    <motion.div
      className={clsx('flex h-dvh items-center justify-center bg-black p-6')}
      initial={{
        background:
          'linear-gradient(-30deg, #C4C1EC 0%, #1D1775 0%, #000000 100%)'
      }}
      animate={{
        background:
          'linear-gradient(-30deg, #C4C1EC, #1D1775 15%, #000000 40%)',
        y: exit ? '-100dvh' : 0
      }}
      transition={{
        duration: 2
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          translateY: 20,
          rotate: 4
        }}
        animate={{
          opacity: 1,
          translateY: 0,
          rotate: 0
        }}
        transition={{
          duration: 2
        }}
      >
        <Logo className="mx-auto h-10 max-w-full" />
      </motion.div>
      <div className="fixed bottom-0"></div>
    </motion.div>
  )
}
