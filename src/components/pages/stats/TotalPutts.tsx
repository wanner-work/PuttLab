import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart.tsx'
import useSessions from '@/hooks/data/sessions/useSessions.ts'
import useUnit from '@/hooks/units/useUnit.ts'
import NumberFlow from '@number-flow/react'
import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'

export default function EightyDistance() {
  const { sessions } = useSessions(false)
  const { unit, getDistance } = useUnit()

  const {
    circleOneAttempts,
    circleTwoAttempts,
    outsideAttempts,
    totalAttempts
  } = useMemo(() => {
    const bullseyeSessions = sessions?.filter((s) => s.distance <= 3) || []
    const circleOneSessions =
      sessions?.filter((s) => s.distance > 3 && s.distance <= 10) || []
    const circleTwoSessions =
      sessions?.filter((s) => s.distance > 10 && s.distance <= 20) || []
    const outsideSessions = sessions?.filter((s) => s.distance > 20) || []

    const totalAttempts =
      sessions?.reduce((sum, session) => sum + session.attempts, 0) || 0

    return {
      bullseyeAttempts: bullseyeSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      circleOneAttempts: circleOneSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      circleTwoAttempts: circleTwoSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      outsideAttempts: outsideSessions.reduce(
        (sum, session) => sum + session.attempts,
        0
      ),
      totalAttempts
    }
  }, [sessions])

  const attemptsData = useMemo(() => {
    const data = []

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
        position: 'no',
        attempts: 1,
        fill: 'var(--muted)'
      })
    }

    return data
  }, [circleOneAttempts, circleTwoAttempts, outsideAttempts])

  const chartConfig = useMemo(() => {
    return {
      no: {
        label: 'No Data'
      },
      position: {
        label: 'Position'
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
    <Card>
      <CardHeader>
        <CardTitle>Attempts by position</CardTitle>
        <CardDescription>Excluding Bullseye</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4 pb-0">
        <div className="shrink-0">
          <div>
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              C1X
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-2 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={circleOneAttempts} />
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              C2
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-3 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={circleTwoAttempts} />
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="-mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Outside
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-chart-4 size-3 rounded" />
              <p className="font-mono text-lg font-bold">
                <NumberFlow value={outsideAttempts} />
              </p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute flex size-full items-center justify-center">
            <div className="text-center">
              <p className="-mb-0.5 text-center text-xs font-bold text-neutral-400 uppercase">
                Total
              </p>
              <div className="flex items-center gap-2">
                <p className="text text-center font-mono font-bold">
                  <NumberFlow value={totalAttempts} />
                </p>
              </div>
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
