import QUERY from '@/constants/QUERY'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import getSessions from '@/methods/data/get/getSessions'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '../ui/chart'

export default function AnalyticsCard() {
  const { data: sessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions()
  })

  const {
    bullseyeAttempts,
    bullseyeHits,
    circleOneAttempts,
    circleOneHits,
    circleTwoAttempts,
    circleTwoHits,
    outsideAttempts,
    outsideHits
  } = useMemo(() => {
    const bullseyeSessions = sessions?.filter((s) => s.distance <= 3) || []
    const circleOneSessions =
      sessions?.filter((s) => s.distance > 3 && s.distance <= 10) || []
    const circleTwoSessions =
      sessions?.filter((s) => s.distance > 10 && s.distance <= 20) || []
    const outsideSessions = sessions?.filter((s) => s.distance > 20) || []

    return {
      bullseyeAttempts: bullseyeSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      bullseyeHits: bullseyeSessions.reduce(
        (sum, session) => sum + session.hits,
        0
      ),
      circleOneAttempts: circleOneSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      circleOneHits: circleOneSessions.reduce(
        (sum, session) => sum + session.hits,
        0
      ),
      circleTwoAttempts: circleTwoSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      circleTwoHits: circleTwoSessions.reduce(
        (sum, session) => sum + session.hits,
        0
      ),
      outsideAttempts: outsideSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      outsideHits: outsideSessions.reduce(
        (sum, session) => sum + session.hits,
        0
      )
    }
  }, [sessions])

  const {
    bullseyeAverage,
    circleOneAverage,
    circleTwoAverage,
    outsideAverage
  } = useMemo(() => {
    const bullseyeAverage = calculatePercentage(bullseyeAttempts, bullseyeHits)

    const circleOneAverage = calculatePercentage(
      circleOneAttempts,
      circleOneHits
    )

    const circleTwoAverage = calculatePercentage(
      circleTwoAttempts,
      circleTwoHits
    )

    const outsideAverage = calculatePercentage(outsideAttempts, outsideHits)

    return {
      bullseyeAverage,
      circleOneAverage,
      circleTwoAverage,
      outsideAverage
    }
  }, [
    bullseyeAttempts,
    bullseyeHits,
    circleOneAttempts,
    circleOneHits,
    circleTwoAttempts,
    circleTwoHits,
    outsideAttempts,
    outsideHits
  ])

  const averageData = useMemo(() => {
    return [
      {
        position: 'bullseye',
        average: bullseyeAverage,
        fill: 'var(--chart-1)'
      },
      {
        position: 'one',
        average: circleOneAverage,
        fill: 'var(--chart-2)'
      },
      {
        position: 'two',
        average: circleTwoAverage,
        fill: 'var(--chart-3)'
      },
      { position: 'outside', average: outsideAverage, fill: 'var(--chart-4)' }
    ]
  }, [bullseyeAverage, circleOneAverage, circleTwoAverage, outsideAverage])

  const attemptsData = useMemo(() => {
    const data = []

    if (bullseyeAttempts > 0) {
      data.push({
        position: 'bullseye',
        attempts: bullseyeAttempts,
        fill: 'var(--chart-1)'
      })
    }

    if (circleOneAttempts > 0) {
      data.push({
        position: 'one',
        attempts: circleOneAttempts,
        fill: 'var(--chart-2)'
      })
    }

    if (circleTwoAttempts > 0) {
      data.push({
        position: 'two',
        attempts: circleTwoAttempts,
        fill: 'var(--chart-3)'
      })
    }

    if (outsideAttempts > 0) {
      data.push({
        position: 'outside',
        attempts: outsideAttempts,
        fill: 'var(--chart-4)'
      })
    }

    if (data.length === 0) {
      data.push({
        position: 'no data',
        attempts: 1,
        fill: 'var(--muted)'
      })
    }

    return data
  }, [bullseyeAttempts, circleOneAttempts, circleTwoAttempts, outsideAttempts])

  const activityData = useMemo(() => {
    const data = []

    // last 20 days with dayjs
    for (let i = 20; i >= 0; i--) {
      const day = dayjs().subtract(i, 'day').startOf('day')

      const daySessions =
        sessions?.filter((s) => dayjs(s.date).isSame(day, 'day')) ?? []

      const attempts = daySessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      )

      data.push({
        date: day.format('DD.MM'),
        attempts
      })
    }

    return data
  }, [sessions])

  const chartConfig = useMemo(() => {
    return {
      position: {
        label: 'Position'
      },
      bullseye: {
        label: 'Bullseye'
      },
      one: {
        label: 'Circle One'
      },
      two: {
        label: 'Circle Two'
      },
      outside: {
        label: 'Outside'
      },
      attempts: {
        label: 'Attempts'
      },
      average: {
        label: 'Average'
      }
    } satisfies ChartConfig
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Your stats over all sessions.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 pb-0">
          <div className="shrink-0">
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Bullseye
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={bullseyeAverage} suffix="%" />
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                C1X
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={circleOneAverage} suffix="%" />
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                C2
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={circleTwoAverage} suffix="%" />
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Outside
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={outsideAverage} suffix="%" />
              </p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="size-[180px]">
            <RadialBarChart
              data={averageData}
              innerRadius={20}
              outerRadius={100}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="position" hideLabel />}
              />
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                dataKey="average"
                angleAxisId={0}
                tick={false}
              />
              <RadialBar dataKey="average" background angleAxisId={0} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Total Throws</CardTitle>
          <CardDescription>All throws across all sessions.</CardDescription>
        </CardHeader>
        <CardContent className="-mt-4">
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[200px] pb-4"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={attemptsData} dataKey="attempts" nameKey="position">
                <LabelList
                  dataKey="position"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Bullseye
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-chart-1 size-3 rounded" />
                <p className="font-mono text-xl font-bold">
                  <NumberFlow value={bullseyeAttempts} />
                </p>
              </div>
            </div>
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Circle One
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-chart-2 size-3 rounded" />
                <p className="font-mono text-xl font-bold">
                  <NumberFlow value={circleOneAttempts} />
                </p>
              </div>
            </div>
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Circle Two
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-chart-3 size-3 rounded" />
                <p className="font-mono text-xl font-bold">
                  <NumberFlow value={circleTwoAttempts} />
                </p>
              </div>
            </div>
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Outside Circle
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-chart-4 size-3 rounded" />
                <p className="font-mono text-xl font-bold">
                  <NumberFlow value={outsideAttempts} />
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Activity</CardTitle>
          <CardDescription>
            See your attempts over the last month.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={activityData}
              margin={{
                left: 12,
                right: 12,
                top: 12
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="attempts"
                type="linear"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-muted-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
