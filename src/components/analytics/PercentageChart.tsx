import QUERY from '@/constants/QUERY'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import { Device } from '@capacitor/device'
import { useQuery } from '@tanstack/react-query'
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
  index?: number
  size?: 'sm' | 'default'
}

export default memo(PercentageChart)

function PercentageChart({
  hits,
  attempts,
  size = 'default'
}: Readonly<Props>) {
  const { data: device } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.DEVICE],
    queryFn: async () => await Device.getInfo(),
    staleTime: Infinity
  })

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
    <ChartContainer
      config={chartConfig}
      className={clsx('grow-0', size === 'sm' ? 'size-[60px]' : 'size-[200px]')}
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
          innerRadius={size === 'sm' ? 0 : 40}
          outerRadius={size === 'sm' ? 20 : 75}
          strokeWidth={5}
          activeIndex={0}
          animationDuration={size === 'sm' ? 0 : 180}
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
                        y={
                          (viewBox.cy || 0) -
                          (device?.operatingSystem === 'ios' ? -10 : 0)
                        }
                        className="fill-foreground text-2xl font-bold"
                      >
                        {percentage}%
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
