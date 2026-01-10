import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import type { Session } from '@/data/entities/session.ts'
import getPercentage from '@/methods/calculations/getPercentage.ts'
import NumberFlow from '@number-flow/react'
import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'

type BucketKey = 'bullseye' | 'c1x' | 'c2' | 'outside'

type BucketAggregate = {
  attempts: number
  hits: number
  makePct: number
}

interface Props {
  specificSessions?: Session[] | null
}

function bucketForDistance(distance: number): BucketKey {
  if (distance <= 3) return 'bullseye'
  if (distance <= 9) return 'c1x'
  if (distance <= 19) return 'c2'
  return 'outside'
}

export default function MakePercentageByPosition({
  specificSessions
}: Readonly<Props>) {
  const buckets = useMemo(() => {
    const initial: Record<BucketKey, BucketAggregate> = {
      bullseye: { attempts: 0, hits: 0, makePct: 0 },
      c1x: { attempts: 0, hits: 0, makePct: 0 },
      c2: { attempts: 0, hits: 0, makePct: 0 },
      outside: { attempts: 0, hits: 0, makePct: 0 }
    }

    if (!specificSessions) return initial

    for (const session of specificSessions) {
      const key = bucketForDistance(session.distance)
      initial[key].attempts += session.attempts
      initial[key].hits += session.hits
    }

    for (const key of Object.keys(initial) as BucketKey[]) {
      const bucket = initial[key]
      bucket.makePct =
        bucket.attempts === 0 ? 0 : getPercentage(bucket.attempts, bucket.hits)
    }

    return initial
  }, [specificSessions])

  const totalAttempts =
    buckets.bullseye.attempts +
    buckets.c1x.attempts +
    buckets.c2.attempts +
    buckets.outside.attempts

  const attemptsData = useMemo(() => {
    const data = []

    if (buckets.bullseye.attempts > 0) {
      data.push({
        position: 'bullseye',
        attempts: buckets.bullseye.attempts,
        fill: 'var(--chart-1)'
      })
    }

    if (buckets.c1x.attempts > 0) {
      data.push({
        position: 'c1x',
        attempts: buckets.c1x.attempts,
        fill: 'var(--chart-2)'
      })
    }

    if (buckets.c2.attempts > 0) {
      data.push({
        position: 'c2',
        attempts: buckets.c2.attempts,
        fill: 'var(--chart-3)'
      })
    }

    if (buckets.outside.attempts > 0) {
      data.push({
        position: 'outside',
        attempts: buckets.outside.attempts,
        fill: 'var(--chart-4)'
      })
    }

    if (data.length === 0) {
      data.push({
        position: 'no',
        attempts: 1,
        fill: 'var(--muted)'
      })
    }

    return data
  }, [buckets])

  const chartConfig = useMemo(() => {
    return {
      no: { label: 'No Data' },
      bullseye: { label: 'Bullseye' },
      c1x: { label: 'C1X' },
      c2: { label: 'C2' },
      outside: { label: 'Outside' },
      position: { label: 'Position' },
      attempts: { label: 'Attempts' }
    } satisfies ChartConfig
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>By position</CardTitle>
        <CardDescription>
          Attempts and make percentage grouped by distance bucket.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 pb-0">
        <div className="shrink-0">
          <div>
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Bullseye
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-1 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={buckets.bullseye.attempts} />
              </p>
              <p className="text-muted-foreground font-mono text-xs font-bold">
                <NumberFlow value={buckets.bullseye.makePct} suffix="%" />
              </p>
            </div>
          </div>

          <div className="mt-1">
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              C1X
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-2 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={buckets.c1x.attempts} />
              </p>
              <p className="text-muted-foreground font-mono text-xs font-bold">
                <NumberFlow value={buckets.c1x.makePct} suffix="%" />
              </p>
            </div>
          </div>

          <div className="mt-1">
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              C2
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-3 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={buckets.c2.attempts} />
              </p>
              <p className="text-muted-foreground font-mono text-xs font-bold">
                <NumberFlow value={buckets.c2.makePct} suffix="%" />
              </p>
            </div>
          </div>

          <div className="mt-1">
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Outside
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-4 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={buckets.outside.attempts} />
              </p>
              <p className="text-muted-foreground font-mono text-xs font-bold">
                <NumberFlow value={buckets.outside.makePct} suffix="%" />
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute flex size-full items-center justify-center">
            <div className="text-center">
              <p className="mx-auto -mb-0.5 text-center text-xs font-bold text-neutral-400 uppercase">
                Total
              </p>
              <p className="mx-auto text-center font-mono font-bold">
                <NumberFlow value={totalAttempts} />
              </p>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="size-[170px]">
            <PieChart>
              <Pie
                data={attemptsData}
                dataKey="attempts"
                innerRadius={40}
                outerRadius={80}
              ></Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
