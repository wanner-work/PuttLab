import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import type { ModeRun } from '@/data/entities/moderun'
import useModeRunHighscore from '@/hooks/data/mode/useModeRunHighscore'
import useModeRunsCalculated from '@/hooks/data/mode/useModeRunsCalculated'
import useParty from '@/hooks/ui/useParty'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import NumberFlow from '@number-flow/react'
import dayjs from 'dayjs'
import party from 'party-js'
import { useEffect, useMemo, useRef } from 'react'
import { CartesianGrid, Line, LineChart, YAxis } from 'recharts'

interface Props {
  modeRuns: ModeRun[] | undefined
  mode: ModeDefinition
}

export default function ModeHighlights({ modeRuns, mode }: Props) {
  const hasRunRef = useRef(false)

  const calculatedRuns = useModeRunsCalculated(mode, modeRuns || [], false)
  const highscoreRun = useModeRunHighscore(mode, modeRuns || [])

  const data = useMemo(() => {
    return calculatedRuns.map((run) => ({
      date: dayjs(run.date).format('MM.DD'),
      score: run.score
    }))
  }, [calculatedRuns])

  const { ref, run } = useParty()

  useEffect(() => {
    if (hasRunRef.current) return
    if (highscoreRun && highscoreRun.score === 100) {
      run({
        count: 20,
        size: party.variation.range(0.8, 1.2)
      })
      hasRunRef.current = true
    }
  }, [highscoreRun, run])

  const latest = useMemo(() => {
    if (calculatedRuns.length === 0) return 'N/A'
    return dayjs().to(dayjs(calculatedRuns.at(-1)?.date))
  }, [calculatedRuns])

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-0 text-xs font-bold text-neutral-400 uppercase">
              Highscore
            </p>
            <p className="font-mono text-3xl font-bold">
              <span ref={ref}>
                <NumberFlow value={highscoreRun?.score || 0} />
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground font-mono text-sm uppercase">
              <NumberFlow
                value={calculatedRuns.length}
                suffix=" finished runs"
              />
            </p>
            <p className="text-muted-foreground font-mono text-sm uppercase">
              Latest: {latest}
            </p>
          </div>
        </div>

        <ChartContainer
          config={{
            score: {
              label: 'Score'
            }
          }}
          className="mt-2 h-[120px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              width={15}
              dataKey="score"
              tickLine={false}
              axisLine={false}
            />
            <Line
              dataKey="score"
              type="linear"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
