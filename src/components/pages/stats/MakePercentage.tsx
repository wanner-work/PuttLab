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

interface Props {
  specificSessions?: Session[] | null
}

export default function MakePercentage({ specificSessions }: Readonly<Props>) {
  const { hits, attempts, average } = useMemo(() => {
    if (!specificSessions) return { hits: 0, attempts: 0, average: 0 }

    const { hits, attempts } = specificSessions.reduce(
      (acc, session) => {
        acc.hits += session.hits
        acc.attempts += session.attempts
        return acc
      },
      { hits: 0, attempts: 0 }
    )

    return {
      hits,
      attempts,
      average: attempts === 0 ? 0 : getPercentage(attempts, hits)
    }
  }, [specificSessions])

  const chartData = useMemo(() => {
    const data = []

    if (attempts === 0) {
      data.push({ status: 'no', attempts: 1, fill: 'var(--muted)' })
      return data
    }

    data.push({ status: 'hits', attempts: hits, fill: 'var(--chart-1)' })
    data.push({
      status: 'misses',
      attempts: attempts - hits,
      fill: 'var(--chart-2)'
    })

    return data
  }, [attempts, hits])

  const chartConfig = useMemo(() => {
    return {
      no: {
        label: 'No Data'
      },
      attempts: {
        label: 'Attempts'
      },
      hits: {
        label: 'Hits'
      },
      misses: {
        label: 'Misses'
      }
    } satisfies ChartConfig
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make percentage</CardTitle>
        <CardDescription>
          Your overall make rate across the selected sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
            Make %
          </p>
          <p className="font-mono text-2xl font-bold">
            <NumberFlow value={average} suffix="%" />
          </p>

          <p className="mt-2 -mb-0.5 text-xs font-bold text-neutral-400 uppercase">
            Attempts
          </p>
          <p className="font-mono text-lg font-bold">
            <NumberFlow value={attempts} />
          </p>

          <p className="mt-2 -mb-0.5 text-xs font-bold text-neutral-400 uppercase">
            Hits
          </p>
          <p className="font-mono text-lg font-bold">
            <NumberFlow value={hits} />
          </p>
        </div>

        <ChartContainer config={chartConfig} className="size-[170px]">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="attempts"
              innerRadius={40}
              outerRadius={80}
            ></Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
