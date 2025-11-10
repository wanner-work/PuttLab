import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import useSessions from '@/hooks/data/sessions/useSessions.ts'
import useProjectedDistanceAverages from '@/hooks/data/stats/useProjectedDistanceAverages.ts'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function ProjectedDistance() {
  const { sessions } = useSessions(false)
  const data = useProjectedDistanceAverages(sessions)

  const chartConfig = {
    distance: {
      label: 'Distance',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average per distance</CardTitle>
        <CardDescription>
          Projected average make percentage for each distance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
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
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              width={20}
              domain={[0, 100]}
            />
            <defs>
              <linearGradient id="fillAverage" x1={0} y1={0} x2={0} y2={1}>
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
              dataKey="average"
              fill="url(#fillAverage)"
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
