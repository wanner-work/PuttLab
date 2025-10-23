import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading'
import SessionList from '@/components/pages/sessions/list/SessionList'
import SessionListFilter from '@/components/pages/sessions/list/SessionListFilter'
import CreateSessionDrawer from '@/components/sessions/actions/CreateSessionDrawer'
import { Button } from '@/components/ui/button'
import type { Session } from '@/data/entities/session'
import useSessions from '@/hooks/data/sessions/useSessions'
import useSessionsFilter from '@/hooks/data/sessions/useSessionsFilter'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PlusIcon } from 'lucide-react'
import { memo, useState } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/sessions/')({
  component: memo(Sessions)
})

function Sessions() {
  const navigate = Route.useNavigate()

  const [filter, setFilter] = useState<number | null>(null)
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)

  const { isLoading, sessions } = useSessions()
  const filteredSessions = useSessionsFilter(sessions || [], filter)

  const onCreateSuccess = (session: Session | undefined) => {
    setCreateDrawerOpen(false)

    if (session) {
      navigate({
        to: '/improved/sessions/$sessionId',
        params: {
          sessionId: String(session.id)
        },
        viewTransition: { types: ['slide-left'] }
      })
    }
  }

  return (
    <Layout rows={['auto', 'auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/improved" />
      <Headline title="Sessions" subtitle="Manage your sessions effectively" />

      <CreateSessionDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        onSuccess={onCreateSuccess}
      />

      <SessionListFilter sessions={sessions || []} onFilter={setFilter} />

      <AnimateLoading
        isLoading={isLoading || !filteredSessions}
        render={({ wasLoading }) => (
          <SessionList
            key={filter}
            wasLoaded={wasLoading}
            sessions={filteredSessions}
          />
        )}
      />

      <div className="fixed bottom-6 left-0 flex w-full justify-center">
        <Button
          onClick={() => setCreateDrawerOpen(true)}
          className="rounded-full"
        >
          <PlusIcon />
          Create Session
        </Button>
      </div>
    </Layout>
  )
}
