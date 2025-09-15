import PercentageChart from '@/components/analytics/PercentageChart'
import Recorder from '@/components/recorder/Recorder'
import QUERY from '@/constants/QUERY'
import getSession from '@/methods/data/get/getSession'
import updateSession from '@/methods/data/update/updateSession'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { Loader2Icon } from 'lucide-react'
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

  const disabled = useMemo(() => {
    if (!session) return true
    if (session.maxAttempts) {
      return session.attempts >= session.maxAttempts
    }
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

    console.log('Updating session', { debouncedAttempts, debouncedHits })

    session.attempts = debouncedAttempts
    session.hits = debouncedHits
    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  return (
    <div
      className="grid h-dvh max-h-full p-6"
      style={{
        gridTemplateRows: 'minmax(0, 1fr) minmax(0, auto)'
      }}
    >
      {isPending && (
        <div className="absolute top-0 right-0 m-4">
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
      <div>
        <div className="mt-12 mb-8 flex w-full items-center justify-around gap-3 px-4 text-center">
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
        <PercentageChart hits={hits} attempts={attempts} />
      </div>
      <Recorder disabled={disabled} hit={onHit} miss={onMiss} batch={onBatch} />
    </div>
  )
}
