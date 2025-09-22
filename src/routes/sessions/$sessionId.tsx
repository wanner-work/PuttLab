import AverageCompare from '@/components/analytics/AverageCompare.tsx'
import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import DeleteSessionDrawer from '@/components/sessions/DeleteSessionDrawer'
import Recorder from '@/components/sessions/recorder/Recorder'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import calculateCirclePosition from '@/methods/calculations/calculateCirclePosition'
import getSameDistanceSessions from '@/methods/data/get/getSameDistanceSessions'
import getSession from '@/methods/data/get/getSession'
import updateSession from '@/methods/data/update/updateSession'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const { mutate } = useMutation({
    mutationFn: updateSession
  })

  const navigate = Route.useNavigate()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: session } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  const { data: sameDistanceSessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, session?.distance],
    queryFn: ({ queryKey }) => getSameDistanceSessions(Number(queryKey[1])),
    enabled: !!session
  })

  const totalAttempts = useMemo(() => {
    if (!session) return 0
    if (!sameDistanceSessions) return 0

    return (
      sameDistanceSessions
        .filter((s) => s.id !== session.id)
        .reduce((sum, session) => sum + session.attempts, 0) || 0
    )
  }, [sameDistanceSessions, session])

  const totalHits = useMemo(() => {
    if (!session) return 0
    if (!sameDistanceSessions) return 0

    return (
      sameDistanceSessions
        .filter((s) => s.id !== session.id)
        .reduce((sum, session) => sum + session.hits, 0) || 0
    )
  }, [sameDistanceSessions, session])

  const disabled = useMemo(() => {
    if (!session) return true
    if (session.maxAttempts) {
      return session.attempts >= session.maxAttempts
    }
  }, [session])

  const position = useMemo(() => {
    if (!session) return '...'
    return calculateCirclePosition(session.distance)
  }, [session])

  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const onHit = () => {
    setHits((h) => h + 1)
    setAttempts((a) => a + 1)
  }

  const onMiss = () => {
    setAttempts((a) => a + 1)
  }

  const onBatch = (attempts: number, hits: number) => {
    setHits((h) => h + hits)
    setAttempts((a) => a + attempts)
  }

  useEffect(() => {
    if (session) {
      setHits(session.hits)
      setAttempts(session.attempts)
    }
  }, [session])

  const debouncedAttempts = useDebounce(attempts, 400)
  const debouncedHits = useDebounce(hits, 400)

  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits
    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back="/sessions"
      actions={
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete
        </Button>
      }
    >
      <DeleteSessionDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        navigate={navigate}
        sessionId={session ? session.id : 0}
        attempts={attempts}
      />
      <div className="flex flex-col justify-evenly overflow-auto pt-6">
        <div className="text-center">
          <p className="text-xs font-bold text-neutral-400 uppercase">
            {position}
          </p>
          <p className="font-mono text-2xl font-bold uppercase">
            <NumberFlow value={session?.distance || 0} /> meter
          </p>
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-96 items-center justify-around gap-3 px-4 text-center">
          <div className="w-32">
            <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
              Hits
            </p>
            <p className="font-mono text-6xl font-bold">
              <NumberFlow value={hits} />
            </p>
          </div>

          <div className="w-32">
            <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
              Misses
            </p>
            <p className="font-mono text-4xl font-bold">
              <NumberFlow value={attempts - hits} />
            </p>
          </div>
        </div>
        <div className="-mt-4 flex items-center justify-center gap-4">
          {totalAttempts > 0 && (
            <AverageCompare
              attempts={attempts}
              totalAttempts={totalAttempts}
              hits={hits}
              totalHits={totalHits}
            />
          )}
          <PercentageChart hits={hits} attempts={attempts} />
        </div>
      </div>
      <Recorder disabled={disabled} hit={onHit} miss={onMiss} batch={onBatch} />
    </PageContainer>
  )
}
