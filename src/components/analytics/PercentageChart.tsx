import { memo, useMemo } from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '../ui/chart'

interface Props {
  hits: number
  attempts: number
}

export default memo(PercentageChart)

function PercentageChart({ hits, attempts }: Props) {
  const percentage = useMemo(() => {
    if (attempts === 0) return 0
    return Math.round((hits / attempts) * 100)
  }, [hits, attempts])

  const chartData = useMemo(() => {
    const isDanger = percentage > 50 && attempts >= 20

    return [
      { name: 'hits', value: hits, fill: 'rgb(22, 111, 251)' },
      {
        name: 'misses',
        value: attempts - hits,
        fill: isDanger ? 'rgba(22, 111, 251, 0.3)' : 'rgba(238, 0, 0, 0.4)'
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
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          animationBegin={0}
          animationDuration={120}
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
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {percentage}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {percentage > 50 && attempts >= 20
                        ? 'lets go!'
                        : 'get better!'}
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
