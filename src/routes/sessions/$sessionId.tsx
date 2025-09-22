import AverageCompare from '@/components/analytics/AverageCompare.tsx'
import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import DeleteSessionDrawer from '@/components/sessions/DeleteSessionDrawer'
import Recorder from '@/components/sessions/recorder/Recorder'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import calculateCirclePosition from '@/methods/calculations/calculateCirclePosition'
import getSession from '@/methods/data/get/getSession'
import getSessionsSumsForDistance from '@/methods/data/get/getSessionsSumsForDistance'
import updateSession from '@/methods/data/update/updateSession'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useBlocker } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Not } from 'typeorm'

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

  const { data: totalHits } = useQuery({
    queryKey: [
      QUERY.CACHE_KEYS.ALL_SESSIONS,
      QUERY.CACHE_KEYS.SESSIONS_SUM,
      'hits',
      session?.distance,
      session?.id
    ],
    queryFn: ({ queryKey }) =>
      getSessionsSumsForDistance('hits', Number(queryKey[3]), {
        id: Not(Number(queryKey[4]))
      }),
    enabled: !!session
  })

  const { data: totalAttempts } = useQuery({
    queryKey: [
      QUERY.CACHE_KEYS.ALL_SESSIONS,
      QUERY.CACHE_KEYS.SESSIONS_SUM,
      'attempts',
      session?.distance,
      session?.id
    ],
    queryFn: ({ queryKey }) =>
      getSessionsSumsForDistance('attempts', Number(queryKey[3]), {
        id: Not(Number(queryKey[4]))
      }),
    enabled: !!session
  })

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

  useBlocker({
    shouldBlockFn: () => {
      if (!session) return false

      return new Promise<boolean>((resolve) => {
        session.attempts = attempts
        session.hits = hits

        if (
          debouncedAttempts === session.attempts &&
          debouncedHits === session.hits
        ) {
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId]
          })
          resolve(false)
        } else {
          mutate(session)
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId]
          })
          resolve(false)
        }
      })
    }
  })

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
          {totalAttempts && totalAttempts > 0 && totalHits && (
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
