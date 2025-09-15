import PercentageChart from '@/components/analytics/PercentageChart'
import Recorder from '@/components/recorder/Recorder'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import calculateCirclePosition from '@/methods/calculations/calculateCirclePosition'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import getSameDistanceSessions from '@/methods/data/get/getSameDistanceSessions'
import getSession from '@/methods/data/get/getSession'
import updateSession from '@/methods/data/update/updateSession'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { CheckIcon, Loader2Icon, MoveLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const { mutate, isPending } = useMutation({
    mutationFn: updateSession
  })

  const { data: session } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  const { data: sameDistanceSessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSameDistanceSessions(session?.distance || 0),
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

  const debouncedAttempts = useDebounce(attempts, 500)
  const debouncedHits = useDebounce(hits, 500)

  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits
    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  const totalAverage = useMemo(() => {
    return calculatePercentage(totalAttempts, totalHits)
  }, [totalAttempts, totalHits])

  const average = useMemo(() => {
    return calculatePercentage(attempts, hits)
  }, [attempts, hits])

  return (
    <div
      className="grid h-dvh max-h-full p-6"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <Link to="/sessions">
          <Button size="sm" variant="outline">
            <MoveLeft />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button size="sm">
            <CheckIcon />
            Finish
          </Button>
        </div>
      </div>
      {isPending && (
        <div className="absolute top-0 right-0 m-4">
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
      <div className="flex flex-col gap-8 overflow-auto py-8">
        <div className="text-center">
          <p className="text-xs font-bold text-neutral-400 uppercase">
            {position}
          </p>
          <p className="font-mono text-2xl font-bold uppercase">
            <NumberFlow value={session?.distance || 0} /> meter
          </p>
        </div>
        <div className="flex w-full items-center justify-around gap-3 px-4 text-center">
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
        <div className="h-full">
          <PercentageChart hits={hits} attempts={attempts} />
        </div>
        {totalAverage > 0 && (
          <div
            className={clsx(
              'flex gap-2',
              totalAverage > average ? 'flex-col' : 'flex-col-reverse'
            )}
          >
            <div>
              <p className="mb-1 text-xs font-bold text-neutral-400">
                Average through all sessions
              </p>
              <div
                className="flex h-5 items-center rounded bg-[#b9d4fe] pl-1.5 text-xs font-bold text-black"
                style={{ width: `${totalAverage}%` }}
              >
                {totalAverage}%
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-neutral-400">
                Current average
              </p>
              <div
                className="flex h-5 items-center rounded bg-[#166ffb] pl-1.5 text-xs font-bold text-white"
                style={{ width: `${average}%` }}
              >
                {average}%
              </div>
            </div>
          </div>
        )}
      </div>
      <Recorder disabled={disabled} hit={onHit} miss={onMiss} batch={onBatch} />
    </div>
  )
}
