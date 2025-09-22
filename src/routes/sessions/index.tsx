import PageContainer from '@/components/basic/PageContainer.tsx'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import QUERY from '@/constants/QUERY'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { PlusIcon, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import CreateSessionDrawer from '@/components/sessions/CreateSessionDrawer'
import SessionListDistanceFilterOptions from '@/components/sessions/list/SessionListDistanceFilterOptions'
import SessionListItem from '@/components/sessions/list/SessionListItem'
import getSessions from '@/methods/data/get/getSessions'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/sessions/')({
  component: Sessions
})

function Sessions() {
  const [createOpen, setCreateOpen] = useState(false)

  const navigate = Route.useNavigate()

  const [distanceFilter, setDistanceFilter] = useState<string | undefined>(
    undefined
  )
  const [distanceFilterOpen, setDistanceFilterOpen] = useState(false)

  const { data: allSessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions()
  })

  const { data: sessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, distanceFilter],
    queryFn: ({ queryKey }) => {
      return getSessions(Number(queryKey[1]))
    },
    enabled: !!distanceFilter
  })

  const amount = useMemo(() => {
    if (allSessions === undefined) {
      return ''
    }

    if (distanceFilter === undefined) {
      if (allSessions.length === 0) {
        return 'No sessions'
      }
      return `${allSessions.length > 1 ? allSessions.length : 'one'} ${allSessions.length === 1 ? 'session' : 'sessions'}`
    } else if (sessions !== undefined) {
      return `${sessions.length > 1 ? sessions.length : 'one'} ${sessions.length === 1 ? 'session' : 'sessions'} for ${distanceFilter} meter`
    }
  }, [sessions, allSessions, distanceFilter])

  const selectedAverage = useMemo(() => {
    if (sessions === undefined || sessions.length === 0) {
      return 0
    }
    const totalAttempts = sessions.reduce(
      (sum, session) => sum + session.attempts,
      0
    )
    const totalHits = sessions.reduce((sum, session) => sum + session.hits, 0)

    return calculatePercentage(totalAttempts, totalHits)
  }, [sessions])

  return (
    <PageContainer
      title="Sessions"
      subtitle="Manage your training sessions"
      back="/"
    >
      <CreateSessionDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        navigate={navigate}
      />

      <div className="flex gap-3">
        <Select
          value={distanceFilter ?? ''}
          onValueChange={(value) => setDistanceFilter(value || undefined)}
          onOpenChange={() => setDistanceFilterOpen(true)}
        >
          <SelectTrigger id="distance" className="w-full">
            <SelectValue placeholder="Filter for distance" />
          </SelectTrigger>

          <SelectContent>
            {distanceFilterOpen && (
              <SessionListDistanceFilterOptions sessions={allSessions || []} />
            )}
          </SelectContent>
        </Select>
        {distanceFilter && (
          <Button
            variant="outline"
            onClick={() => setDistanceFilter(undefined)}
          >
            <X />
          </Button>
        )}
      </div>
      <div className="my-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm uppercase">{amount}</p>
        <p className="text-muted-foreground font-mono text-sm font-bold">
          <NumberFlow value={selectedAverage} suffix="%" />
        </p>
      </div>
      <div className="mb-20 flex flex-col gap-3">
        {(sessions || allSessions)?.map((session, index) => (
          <SessionListItem key={session.id} session={session} index={index} />
        ))}
      </div>
      <Button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full font-bold"
        onClick={() => setCreateOpen(true)}
      >
        <PlusIcon strokeWidth={3} />
        Create Session
      </Button>
    </PageContainer>
  )
}
