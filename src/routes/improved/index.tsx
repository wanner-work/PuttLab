import Header from '@/components/common/layout/Header'
import Layout from '@/components/common/layout/Layout'
import Intro from '@/components/pages/home/Intro'
import CreateSessionDrawer from '@/components/sessions/actions/CreateSessionDrawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Session } from '@/data/entities/session'
import useSettings from '@/hooks/data/settings/useSettings'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChartBar, Layers, MenuIcon, Play, Plus } from 'lucide-react'
import { memo, useState } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/')({
  component: memo(Home),
  validateSearch: (search: { internal: boolean }) => {
    return {
      internal: search.internal
    }
  }
})

function Home() {
  const { internal } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { settings } = useSettings()

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)

  const onCreateSuccess = (session: Session | undefined) => {
    setCreateDrawerOpen(false)

    if (session) {
      // waiting for the drawer to close
      setTimeout(() => {
        navigate({
          to: '/improved/sessions/$sessionId',
          params: {
            sessionId: String(session.id)
          },
          viewTransition: { types: ['slide-left'] }
        })
      }, 200)
    }
  }

  return (
    <Layout rows={['auto', '1fr', 'auto']}>
      <Header className="mt-4">
        <Link
          to="/improved/settings"
          viewTransition={{ types: ['slide-left'] }}
        >
          <Button size="icon" variant="outline">
            <MenuIcon />
          </Button>
        </Link>
      </Header>

      <CreateSessionDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        onSuccess={onCreateSuccess}
      />

      <Intro animate={!internal && settings?.intro} />

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => setCreateDrawerOpen(true)}>
          <CardContent>
            <Plus />
            <p className="mt-5 text-lg font-medium select-none">
              Create a <br /> session
            </p>
          </CardContent>
        </Card>
        <Link
          to="/improved/sessions"
          viewTransition={{ types: ['slide-left'] }}
        >
          <Card>
            <CardContent>
              <Play />
              <p className="mt-5 text-lg font-medium select-none">
                Play a <br />
                mode
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link
          to="/improved/sessions"
          viewTransition={{ types: ['slide-left'] }}
        >
          <Card>
            <CardContent>
              <Layers />
              <p className="mt-5 text-lg font-medium select-none">
                View all <br />
                sessions
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link
          to="/improved/sessions"
          viewTransition={{ types: ['slide-left'] }}
        >
          <Card>
            <CardContent>
              <ChartBar />
              <p className="mt-5 text-lg font-medium select-none">
                View your <br />
                stats
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </Layout>
  )
}
