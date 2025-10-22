import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import LoadingDisplay from '@/components/common/loading/LoadingDisplay'
import SessionList from '@/components/pages/sessions/list/SessionList'
import SessionListFilter from '@/components/pages/sessions/list/SessionListFilter'
import useSessions from '@/hooks/data/sessions/useSessions'
import useSessionsFilter from '@/hooks/data/sessions/useSessionsFilter'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AnimatePresence } from 'motion/react'
import { memo, useState } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/sessions/')({
  component: memo(Sessions)
})

function Sessions() {
  const [filter, setFilter] = useState<number | null>(null)
  const { isLoading, sessions } = useSessions()
  const filteredSessions = useSessionsFilter(sessions || [], filter)

  return (
    <Layout rows={['auto', 'auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/improved" />
      <Headline title="Sessions" subtitle="Manage your sessions effectively" />

      <SessionListFilter sessions={sessions || []} onFilter={setFilter} />

      <AnimatePresence mode="wait">
        {isLoading || !filteredSessions ? (
          <LoadingDisplay />
        ) : (
          <SessionList key={filter} sessions={filteredSessions} />
        )}
      </AnimatePresence>
    </Layout>
  )
}
