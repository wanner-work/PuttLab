import Reveal from '@/components/animations/Reveal'
import AnimatedIcon from '@/components/brand/AnimatedIcon'
import AnimatedLogo from '@/components/brand/AnimatedLogo'
import CreateSessionDrawer from '@/components/sessions/actions/CreateSessionDrawer.tsx'
import SettingsDrawer from '@/components/settings/SettingsDrawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import QUERY from '@/constants/QUERY'
import getSessions from '@/methods/data/get/getSessions'
import getSettings from '@/methods/data/get/getSettings'
import { Capacitor } from '@capacitor/core'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { AlertCircle, ChartPie, CogIcon, Layers, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { memo, useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/')({
  component: memo(Index),
  validateSearch: (search: { internal: boolean }) => {
    return {
      internal: search.internal
    }
  }
})

function Index() {
  const { internal } = Route.useSearch()

  const { data: settings } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SETTINGS],
    queryFn: getSettings
  })

  const navigate = Route.useNavigate()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const actions = [
    {
      title: 'Start new Session',
      icon: Play,
      action: () => {
        setCreateOpen(true)
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
    void QUERY.CLIENT.prefetchQuery({
      queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
      queryFn: () => getSessions()
    })
  }, [])

  const displayIntro = useMemo(() => {
    if (settings) {
      return !internal && settings?.intro !== false
    } else {
      return false
    }
  }, [internal, settings])

  return (
    <motion.div
      className={clsx(
        'grid h-dvh bg-no-repeat p-6 [view-transition-name:main-content]',
        Capacitor.getPlatform() === 'ios' && 'pt-20',
        Capacitor.getPlatform() === 'web' &&
          'mx-auto max-w-[440px] rounded-[38px]'
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
      {displayIntro && <AnimatedLogo />}
      <div className="mt-2 flex h-[48px] items-center justify-between">
        <AnimatedIcon
          shouldExit={false}
          delay={displayIntro ? 3 : 0}
          className="-ml-[18px]"
        />

        <Reveal delay={displayIntro ? 3.2 : 0}>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setSettingsOpen(true)}
          >
            <CogIcon />
          </Button>
        </Reveal>
      </div>

      <CreateSessionDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(newSession) => {
          void navigate({
            to: '/sessions/$sessionId',
            params: { sessionId: String(newSession.id) },
            viewTransition: { types: ['slide-left'] }
          })
        }}
      />

      {settings && (
        <SettingsDrawer
          initialSettings={settings}
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onSuccess={() => {
            QUERY.CLIENT.invalidateQueries({
              queryKey: [QUERY.CACHE_KEYS.SETTINGS]
            })
            QUERY.CLIENT.prefetchQuery({
              queryKey: [QUERY.CACHE_KEYS.SETTINGS],
              queryFn: getSettings
            })
            setSettingsOpen(false)
          }}
        />
      )}

      <div className="flex h-full flex-col justify-between gap-12">
        <Reveal
          delay={displayIntro ? 3.4 : 0}
          className="flex h-full items-center"
        >
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
              transition={{ delay: (displayIntro ? 3.6 : 0.1) + index * 0.1 }}
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
