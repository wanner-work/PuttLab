import PageContainer from '@/components/basic/PageContainer.tsx'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { memo, Suspense } from 'react'

import NewSessionList from '@/components/sessions/list/NewSessionList'
import QUERY from '@/constants/QUERY'
import getSessions from '@/methods/data/get/getSessions'
import { useQuery } from '@tanstack/react-query'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/')({
  component: memo(Sessions)
})

function Sessions() {
  const sessionsQuery = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions()
  })

  return (
    <PageContainer
      title="Sessions"
      subtitle="Manage your training sessions"
      back="/"
      style={{
        gridTemplateRows:
          'minmax(0, auto) minmax(0, auto) minmax(0, auto) minmax(0, auto) minmax(0, 1fr)'
      }}
      className="grid h-dvh pb-0"
    >
      <Suspense fallback={<div>Loading sessions...</div>}>
        <NewSessionList query={sessionsQuery} />
      </Suspense>
    </PageContainer>
  )
}
