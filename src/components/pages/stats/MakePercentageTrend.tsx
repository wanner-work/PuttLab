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
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface Props {
  specificSessions?: Session[] | null
}

export default function MakePercentageTrend({
  specificSessions
}: Readonly<Props>) {
  const data = useMemo(() => {
    const sessions = specificSessions || []

    if (sessions.length === 0) return []

    return [...sessions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((session) => ({
        date: dayjs(session.date).format('MMM D'),
        attempts: session.attempts,
        hits: session.hits,
        makePct:
          session.attempts === 0
            ? 0
            : getPercentage(session.attempts, session.hits)
      }))
  }, [specificSessions])

  const chartConfig = useMemo(() => {
    return {
      makePct: {
        label: 'Make %',
        color: 'var(--chart-1)'
      }
    } satisfies ChartConfig
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend</CardTitle>
        <CardDescription>Make percentage for each session.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              width={26}
              domain={[0, 100]}
            />
            <defs>
              <linearGradient id="fillMakePct" x1={0} y1={0} x2={0} y2={1}>
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="makePct"
              fill="url(#fillMakePct)"
              type="natural"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
