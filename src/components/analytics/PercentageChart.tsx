import calculatePercentage from '@/methods/calculations/calculatePercentage'
import { memo, useMemo } from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { ChartContainer, type ChartConfig } from '../ui/chart'

interface Props {
  hits: number
  attempts: number
}

export default memo(PercentageChart)

function PercentageChart({ hits, attempts }: Readonly<Props>) {
  const percentage = useMemo(() => {
    return calculatePercentage(attempts, hits)
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
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={undefined}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {percentage}%
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
