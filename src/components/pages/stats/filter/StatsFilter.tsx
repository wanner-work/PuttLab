import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import {
  WheelPicker,
  WheelPickerWrapper
} from '@/components/ui/wheel-picker.tsx'
import useUnit from '@/hooks/units/useUnit.ts'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const years = (() => {
  const startYear = 2025
  const currentYear = new Date().getFullYear()

  // return an array of years from startYear to currentYear
  const yearsArray = []
  for (let year = startYear; year <= currentYear; year++) {
    yearsArray.push(year.toString())
  }
  return yearsArray.reverse()
})()

const distances = Array.from({ length: 50 }, (_, i) => (i + 1).toString())

interface Props {
  onChange: (filter: FilterValue) => void
}

export default function StatsFilter({ onChange }: Readonly<Props>) {
  const [timeframe, setTimeframe] = useState<'year' | 'month' | 'day' | 'all'>(
    'all'
  )
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [month, setMonth] = useState(months[0])
  const [year, setYear] = useState(years[0])

  const [distanceMode, setDistanceMode] = useState<'dg' | 'unit'>('dg')
  const [distance, setDistance] = useState('all')

  const { unit, getDistance } = useUnit()

  const onDistanceModeChange = (value: string) => {
    if (value === 'dg') {
      setDistance('all')
    } else if (value === 'unit') {
      setDistance('8')
    }
    setDistanceMode(value as 'dg' | 'unit')
  }

  const onTimeframeChange = (value: string) => {
    setTimeframe(value as 'year' | 'month' | 'day' | 'all')
  }

  const filter = useMemo(() => {
    let filter: Partial<FilterValue> = {
      timeframe,
      distanceMode,
      distance
    }

    if (timeframe === 'month') {
      filter.date = dayjs(`${year}-${month}`, 'YYYY-MMMM').format('YYYY-MM')
    } else if (timeframe === 'year') {
      filter.date = year
    } else if (timeframe === 'day') {
      filter.date = dayjs(date).format('YYYY-MM-DD')
    }

    return filter as FilterValue
  }, [timeframe, date, month, year, distanceMode, distance])

  useEffect(() => {
    onChange(filter)
  }, [filter])

  return (
    <div className="flex flex-col gap-3">
      {/* @ts-ignore because the timeframe is correctly typed */}
      <Select value={timeframe} onValueChange={onTimeframeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all" className="rounded-t-[20px]">
              All time
            </SelectItem>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year" className="rounded-b-[20px]">
              Year
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {timeframe === 'day' && (
        <Input
          type="date"
          placeholder="Select a date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      )}

      {(timeframe === 'year' || timeframe === 'month') && (
        <div className="flex gap-3">
          {timeframe === 'month' && (
            <WheelPickerWrapper className="rounded-3xl">
              <WheelPicker
                options={months.map((month) => ({
                  label: month,
                  value: month
                }))}
                value={month}
                onValueChange={(value) => setMonth(value)}
              />
            </WheelPickerWrapper>
          )}
          <WheelPickerWrapper className="rounded-3xl">
            <WheelPicker
              options={years.map((year) => ({ label: year, value: year }))}
              value={year}
              onValueChange={(value) => setYear(value)}
            />
          </WheelPickerWrapper>
        </div>
      )}

      {/* @ts-ignore because the distance mode is correctly typed */}
      <Tabs value={distanceMode} onValueChange={onDistanceModeChange}>
        <TabsList className="w-full rounded-3xl">
          <TabsTrigger className="w-full px-0 py-3" value="dg">
            Disc Golf Units
          </TabsTrigger>
          <TabsTrigger className="w-full px-0 py-3" value="unit">
            In {unit}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {distanceMode === 'dg' && (
        <Select value={distance} onValueChange={setDistance}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all" className="rounded-t-[20px]">
                All distances
              </SelectItem>
              <SelectItem value="bullseye">Bullseye</SelectItem>
              <SelectItem value="c1x">C1X</SelectItem>
              <SelectItem value="c2">C2</SelectItem>
              <SelectItem value="outside" className="rounded-b-[20px]">
                Outside Circle
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {distanceMode === 'unit' && (
        <WheelPickerWrapper className="rounded-3xl">
          <WheelPicker
            options={distances.map((distance) => ({
              label: `${getDistance(Number(distance))} ${unit}`,
              value: distance
            }))}
            value={distance}
            onValueChange={(value) => setDistance(value)}
          />
        </WheelPickerWrapper>
      )}
    </div>
  )
}
