import calculatePercentage from '@/methods/calculations/calculatePercentage'
import clsx from 'clsx'
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
  size?: 'sm' | 'default'
}

export default memo(PercentageChart)

function PercentageChart({
  hits,
  attempts,
  size = 'default'
}: Readonly<Props>) {
  const percentage = useMemo(() => {
    return calculatePercentage(attempts, hits)
  }, [hits, attempts])

  const chartData = useMemo(() => {
    const isDanger = percentage < 50 && attempts >= 20

    return [
      { name: 'hits', value: hits, fill: 'rgb(22, 111, 251)' },
      {
        name: 'misses',
        value: attempts - hits,
        fill: isDanger ? 'rgba(238, 0, 0, 0.4)' : 'rgba(22, 111, 251, 0.3)'
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
      className={clsx('grow-0', size === 'sm' ? 'size-[60px]' : 'size-[220px]')}
    >
      <PieChart>
        {size !== 'sm' && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        )}
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={size === 'sm' ? 0 : 50}
          outerRadius={size === 'sm' ? 20 : 80}
          strokeWidth={5}
          activeIndex={0}
          animationBegin={0}
          animationDuration={120}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector
              {...props}
              outerRadius={size === 'sm' ? outerRadius : outerRadius + 10}
            />
          )}
        >
          {size !== 'sm' && (
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
                        y={(viewBox.cy || 0) - 4}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {percentage}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground"
                      >
                        {percentage < 50 && attempts >= 20
                          ? 'get better!'
                          : 'lets go!'}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
