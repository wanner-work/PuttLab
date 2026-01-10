import { Card, CardContent } from '@/components/ui/card.tsx'
import type { Session } from '@/data/entities/session.ts'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface Props {
  isLoading?: boolean
  filter: FilterValue
  sessions?: Session[] | null
}

export default function SelectedSessions({
  isLoading,
  filter,
  sessions
}: Readonly<Props>) {
  const { sessionsCount, attempts, hits } = useMemo(() => {
    const sessionsCount = sessions?.length ?? 0
    const attempts = sessions?.reduce((sum, s) => sum + s.attempts, 0) ?? 0
    const hits = sessions?.reduce((sum, s) => sum + s.hits, 0) ?? 0

    return { sessionsCount, attempts, hits }
  }, [sessions])

  const sessionsLabel = useMemo(() => {
    if (sessionsCount === 0) return 'No sessions'
    if (sessionsCount === 1) return '1 SESSION'
    return `${sessionsCount} SESSIONS`
  }, [sessionsCount])

  const distanceLabel = useMemo(() => {
    if (filter.distanceMode === 'dg') {
      if (filter.distance === 'all') return 'All distances'
      if (filter.distance === 'bullseye') return 'Bullseye'
      if (filter.distance === 'c1x') return 'Circle 1 (C1X)'
      if (filter.distance === 'c2') return 'Circle 2 (C2)'
      if (filter.distance === 'outside') return 'Outside'
      return 'All distances'
    }

    const distance = Number(filter.distance)
    if (Number.isFinite(distance)) return `${distance}m`

    return 'All distances'
  }, [filter.distance, filter.distanceMode])

  const timeframeLabel = useMemo(() => {
    if (filter.timeframe === 'all') return 'All time'

    if (filter.timeframe === 'day') {
      return filter.date ? dayjs(filter.date).format('MMM D, YYYY') : 'One day'
    }

    if (filter.timeframe === 'month') {
      return filter.date ? dayjs(filter.date).format('MMMM YYYY') : 'One month'
    }

    if (filter.timeframe === 'year') {
      return filter.date ? dayjs(filter.date).format('YYYY') : 'One year'
    }

    return 'All time'
  }, [filter.date, filter.timeframe])

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{sessionsLabel}</p>
            <p className="text-muted-foreground text-sm">
              {timeframeLabel} · {distanceLabel}
            </p>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Attempts
            </p>
            <p className="font-mono text-lg font-bold">{attempts}</p>
          </div>
          <div>
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Hits
            </p>
            <p className="font-mono text-lg font-bold">{hits}</p>
          </div>
          <div>
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Misses
            </p>
            <p className="font-mono text-lg font-bold">{attempts - hits}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
