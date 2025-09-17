import AnimatedIcon from '@/components/brand/AnimatedIcon'
import AnimatedLogo from '@/components/brand/AnimatedLogo'
import CreateSession from '@/components/sessions/CreateSession'
import { Card, CardContent } from '@/components/ui/card'
import { Capacitor } from '@capacitor/core'
import { createFileRoute } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { ChartPie, Layers, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  const navigate = Route.useNavigate()

  const [open, setOpen] = useState(false)

  const actions = [
    {
      title: 'Start new Session',
      icon: Play,
      action: () => {
        setOpen(true)
      }
    },
    {
      title: 'View sessions',
      icon: Layers,
      action: () => {
        navigate({ to: '/sessions' })
      }
    },
    {
      title: 'Show analytics',
      icon: ChartPie,
      action: () => {
        navigate({ to: '/analytics' })
      }
    }
  ]

  return (
    <motion.div
      className={clsx(
        'grid h-dvh bg-no-repeat p-6',
        Capacitor.getPlatform() === 'ios' && 'pt-20'
      )}
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr)'
      }}
      initial={{
        background:
          'linear-gradient(-30deg, #36309400 0%, #1D177500 0%, #00000000 0%)'
      }}
      animate={{
        background:
          'linear-gradient(-30deg, #363094FF 0%, #1D1775FF 15%, #000000FF 55%)'
      }}
      transition={{
        duration: 2.6,
        ease: 'easeInOut'
      }}
    >
      <AnimatedLogo />
      <AnimatedIcon shouldExit={false} delay={3} className="mt-2 -ml-[18px]" />

      <CreateSession open={open} onOpenChange={setOpen} />

      <motion.div
        initial={{ opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
        animate={{
          opacity: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
        }}
        transition={{ delay: 3.4 }}
        className="mt-12 self-center"
      >
        <h1 className="text-4xl">
          Step right <strong>back</strong>
          <br /> into <strong>the action</strong>
        </h1>

        <div className="mt-14 grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.6 + index * 0.1 }}
              className="hover:opacity-90 active:scale-[0.98] active:opacity-50"
              onClick={action.action}
            >
              <Card>
                <CardContent className="flex h-full flex-col justify-between gap-5">
                  <action.icon className="" />
                  <p className="text-lg font-semibold select-none">
                    {action.title}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="fixed bottom-0"></div>
    </motion.div>
  )
}
