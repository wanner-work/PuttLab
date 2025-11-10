import getPercentage from '@/methods/calculations/getPercentage.ts'
import NumberFlow from '@number-flow/react'
import { memo, useMemo } from 'react'
import { Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { ChartContainer, type ChartConfig } from '../../../ui/chart'

interface Props {
  hits: number
  attempts: number
}

export default memo(RecorderStatsChart)

function RecorderStatsChart({ hits, attempts }: Readonly<Props>) {
  const percentage = useMemo(() => {
    return getPercentage(attempts, hits)
  }, [hits, attempts])

  const chartData = useMemo(() => {
    const isDanger = percentage < 50 && attempts >= 20

    return [
      { name: 'hits', value: hits, fill: '#332d90' },
      {
        name: 'misses',
        value: attempts - hits,
        fill: isDanger ? '#c56e6e45' : '#332d9045'
      }
    ]
  }, [hits, attempts, percentage])

  const chartConfig = {
    hits: {
      label: 'Hits'
    },
    misses: {
      label: 'Misses'
    }
  } satisfies ChartConfig

  return (
    <div className="relative">
      <ChartContainer config={chartConfig} className="size-[200px] grow-0">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={75}
            strokeWidth={5}
            activeIndex={0}
            animationBegin={0}
            animationDuration={180}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <Sector {...props} outerRadius={outerRadius + 10} />
            )}
          />
        </PieChart>
      </ChartContainer>
      <div className="absolute top-1/2 left-1/2 -translate-1/2 font-mono text-xl font-bold">
        <NumberFlow value={percentage} suffix="%" />
      </div>
    </div>
  )
}
