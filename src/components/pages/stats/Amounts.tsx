import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import type { Session } from '@/data/entities/session.ts'
import NumberFlow from '@number-flow/react'
import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'

interface Props {
  specificSessions?: Session[] | null
}

export default function Amounts({ specificSessions }: Readonly<Props>) {
  const { hits, attempts } = useMemo(() => {
    if (!specificSessions) return { hits: 0, attempts: 0 }

    return specificSessions.reduce(
      (acc, session) => {
        acc.hits += session.hits
        acc.attempts += session.attempts
        return acc
      },
      { hits: 0, attempts: 0 }
    )
  }, [specificSessions])

  const chartData = useMemo(() => {
    const data = []

    data.push({
      status: 'hits',
      attempts: attempts,
      fill: 'var(--chart-1)'
    })

    data.push({
      status: 'misses',
      attempts: attempts - hits,
      fill: 'var(--chart-2)'
    })

    return data
  }, [hits, attempts])

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
      }
    } satisfies ChartConfig
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amounts</CardTitle>
        <CardDescription>
          The amounts of putts and makes in the selected sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="-mt-2 -mb-0.5 text-xs font-bold text-neutral-400 uppercase">
            Attempts
          </p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-lg font-bold">
              <NumberFlow value={attempts} />
            </p>
          </div>
          <p className="mt-2 -mb-0.5 text-xs font-bold text-neutral-400 uppercase">
            Hits
          </p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-lg font-bold">
              <NumberFlow value={hits} />
            </p>
          </div>
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
