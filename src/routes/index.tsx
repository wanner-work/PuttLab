import Reveal from '@/components/animations/Reveal'
import AnimatedIcon from '@/components/brand/AnimatedIcon'
import AnimatedLogo from '@/components/brand/AnimatedLogo'
import CreateSessionDrawer from '@/components/sessions/CreateSessionDrawer'
import { Card, CardContent } from '@/components/ui/card'
import QUERY from '@/constants/QUERY'
import getSessions from '@/methods/data/get/getSessions'
import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { createFileRoute } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { AlertCircle, ChartPie, Layers, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
  validateSearch: (search: { internal: boolean }) => {
    return {
      internal: search.internal
    }
  }
})

function Index() {
  const { internal } = Route.useSearch()

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
        navigate({ to: '/sessions', viewTransition: { types: ['slide-left'] } })
      }
    },
    {
      title: 'Show analytics',
      icon: ChartPie,
      action: () => {
        navigate({
          to: '/analytics',
          viewTransition: { types: ['slide-left'] }
        })
      }
    },
    {
      title: 'Information & Help',
      icon: AlertCircle,
      action: () => {
        navigate({
          to: '/info',
          viewTransition: { types: ['slide-left'] }
        })
      }
    }
  ]

  useEffect(() => {
    QUERY.CLIENT.prefetchQuery({
      queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
      queryFn: () => getSessions()
    })

    QUERY.CLIENT.prefetchQuery({
      queryKey: [QUERY.CACHE_KEYS.DEVICE],
      queryFn: async () => await Device.getInfo()
    })
  }, [])

  return (
    <motion.div
      className={clsx(
        'grid h-dvh bg-no-repeat p-6 [view-transition-name:main-content]',
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
      {!internal && <AnimatedLogo />}
      <div className="mt-2 flex h-[48px] items-center">
        <AnimatedIcon
          shouldExit={false}
          delay={internal ? 0 : 3}
          className="-ml-[18px]"
        />
      </div>

      <CreateSessionDrawer
        open={open}
        onOpenChange={setOpen}
        navigate={navigate}
      />

      <div className="flex h-full flex-col justify-between gap-12">
        <Reveal delay={internal ? 0 : 3.4} className="flex h-full items-center">
          <h1 className="pt-16 text-4xl">
            Step right <strong>back</strong>
            <br /> into <strong>the action</strong>
          </h1>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (internal ? 0.1 : 3.6) + index * 0.1 }}
              className="h-full hover:opacity-90 active:scale-[0.98] active:opacity-50"
              onClick={action.action}
            >
              <Card className="h-full">
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
      </div>

      <div className="fixed bottom-0"></div>
    </motion.div>
  )
}
