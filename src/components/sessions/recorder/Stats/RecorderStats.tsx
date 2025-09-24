import RecorderStatsChart from '@/components/sessions/recorder/Stats/RecorderStatsChart.tsx'
import QUERY from '@/constants/QUERY.ts'
import type { Session } from '@/data/entities/session.ts'
import calculatePercentage from '@/methods/calculations/calculatePercentage.ts'
import getSessionsSumsForDistance from '@/methods/data/get/getSessionsSumsForDistance.ts'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Not } from 'typeorm'

interface Props {
  session: Session | null | undefined
  hits: number
  attempts: number
}

export default function RecorderStats({
  session,
  hits = 0,
  attempts = 0
}: Readonly<Props>) {
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

  const average = useMemo(() => {
    return calculatePercentage(attempts, hits)
  }, [hits, attempts])

  const totalAverage = useMemo(() => {
    if (!totalHits || !totalAttempts) {
      return 0
    }
    return calculatePercentage(totalAttempts, totalHits)
  }, [totalHits, totalAttempts])

  const diff = useMemo(() => {
    return average - totalAverage
  }, [average, totalAverage])

  return (
    <>
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
        {totalAttempts && totalAttempts > 0 && (
          <div className="flex shrink-0 flex-col justify-center gap-2 pl-4">
            <div className="w-[90px]">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Average
              </p>
              <p className="font-mono text-2xl font-bold">
                <NumberFlow value={totalAverage} />%
              </p>
            </div>
            <div className="w-[90px]">
              <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
                Difference
              </p>
              <p className="font-mono text-4xl font-bold">
                <NumberFlow value={diff} />%
              </p>
            </div>
          </div>
        )}
        <RecorderStatsChart hits={hits} attempts={attempts} />
      </div>
    </>
  )
}
