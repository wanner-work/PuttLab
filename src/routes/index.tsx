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
    }, 2800)
  }, [])

  return (
    <motion.div
      className={clsx(
        'flex h-dvh items-center justify-center bg-no-repeat p-6'
      )}
      initial={{
        background:
          'linear-gradient(-30deg, #C4C1EC 0%, #1D1775 0%, #000000 100%)'
      }}
      animate={{
        background: 'linear-gradient(-30deg, #C4C1EC, #1D1775 15%, #000000 40%)'
      }}
      transition={{
        duration: 2
      }}
    >
      <motion.div
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
        <motion.div
          initial={{
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
          }}
          animate={{
            clipPath: exit
              ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
              : 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)'
          }}
          transition={{
            duration: exit ? 0.6 : 1,
            delay: 0.3
          }}
        >
          <Logo className="mx-auto h-10 max-w-full" />
        </motion.div>
      </motion.div>
      <div className="fixed bottom-0"></div>
    </motion.div>
  )
}
