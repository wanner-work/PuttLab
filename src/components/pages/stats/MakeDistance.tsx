import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import useSessions from '@/hooks/data/sessions/useSessions.ts'
import useProjectedDistanceAverage from '@/hooks/data/stats/useProjectedDistanceAverage.ts'
import { Line, LineChart, XAxis } from 'recharts'

interface Props {}

export default function MakeDistance({}: Readonly<Props>) {
  const { sessions } = useSessions(false)
  const data = useProjectedDistanceAverage(sessions)

  const chartConfig = {
    distance: {
      label: 'Distance',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guaranteed Putt</CardTitle>
        <CardDescription>
          The calculated distance, from where you have a 80% chance of making
          the putt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-xl">8.4 METER</p>

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Line
              dataKey="average"
              type="natural"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
