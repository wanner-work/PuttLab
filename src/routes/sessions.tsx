import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type PuttData from '@/interfaces/data/PuttData'
import NumberFlow from '@number-flow/react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export const Route = createFileRoute('/sessions')({
  component: RouteComponent
})

const chartConfig = {
  hits: {
    label: 'Hits',
    color: '#2563eb'
  },
  misses: {
    label: 'Misses',
    color: '#9b26c5'
  }
} satisfies ChartConfig

function RouteComponent() {
  const [batchPutts, setBatchPutts] = useState<number>(0)
  const [batchHits, setBatchHits] = useState<number>(0)

  const [selectedDistance, setSelectedDistance] = useState<string>('4')
  const [customDistance, setCustomDistance] = useState<number>(10)
  const [hits, setHits] = useState<PuttData[]>([])
  const [misses, setMisses] = useState<PuttData[]>([])

  const chartData = useMemo(() => {
    const data: { distance: string; misses: number; hits: number }[] = []

    hits.forEach((hit) => {
      const distanceLabel = `${hit.distance}m`
      const existingEntry = data.find(
        (entry) => entry.distance === distanceLabel
      )

      if (existingEntry) {
        existingEntry.hits += 1
      } else {
        data.push({ distance: distanceLabel, hits: 1, misses: 0 })
      }
    })

    misses.forEach((miss) => {
      const distanceLabel = `${miss.distance}m`
      const existingEntry = data.find(
        (entry) => entry.distance === distanceLabel
      )

      if (existingEntry) {
        existingEntry.misses += 1
      } else {
        data.push({ distance: distanceLabel, hits: 0, misses: 1 })
      }
    })

    data.sort((a, b) => {
      const distA = parseInt(a.distance)
      const distB = parseInt(b.distance)
      return distA - distB
    })

    return data
  }, [hits, misses])

  const addHits = (amount: number = 1) => {
    const distance =
      selectedDistance === 'custom'
        ? customDistance
        : parseInt(selectedDistance || '0')

    for (let i = 0; i < amount; i++) {
      setHits((prev) => [
        ...prev,
        { date: new Date().toISOString(), distance, result: 'hit' }
      ])
    }
  }

  const distanceWarning = useMemo(() => {
    const distance =
      selectedDistance === 'custom'
        ? customDistance
        : parseInt(selectedDistance || '0')

    const totalHitsForDistance = hits.filter(
      (h) => h.distance === distance
    ).length
    const totalMissesForDistance = misses.filter(
      (m) => m.distance === distance
    ).length
    const totalAttempts = totalHitsForDistance + totalMissesForDistance

    if (totalAttempts >= 20 && totalHitsForDistance / totalAttempts < 0.5) {
      return `Your hit rate for ${distance}m is below 50% (${(
        (totalHitsForDistance / totalAttempts) *
        100
      ).toFixed(
        1
      )}% over ${totalAttempts} attempts). Consider reducing your distance.`
    }

    return null
  }, [selectedDistance, customDistance, hits, misses])

  const addMisses = (amount: number = 1) => {
    const distance =
      selectedDistance === 'custom'
        ? customDistance
        : parseInt(selectedDistance || '0')

    for (let i = 0; i < amount; i++) {
      setMisses((prev) => [
        ...prev,
        { date: new Date().toISOString(), distance, result: 'miss' }
      ])
    }
  }

  const submitBatch = () => {
    const misses = batchPutts - batchHits

    addHits(batchHits)
    addMisses(misses)

    setBatchPutts(0)
    setBatchHits(0)
  }

  return (
    <div className="">
      <div className="mt-12 mb-8 flex w-full items-center justify-around gap-3 px-4 text-center">
        <div className="w-32">
          <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
            Hits
          </p>
          <p className="font-mono text-6xl font-bold">
            <NumberFlow value={hits.length} />
          </p>
        </div>

        <div className="w-32">
          <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
            Misses
          </p>
          <p className="font-mono text-4xl font-bold">
            <NumberFlow value={misses.length} />
          </p>
        </div>
      </div>

      <div className="relative mb-8">
        {chartData.length === 0 && (
          <div className="absolute inset-0 z-10 flex size-full items-center justify-center">
            <p className="text-center text-sm text-neutral-400">
              Start recording your putts <br />
              to see charts...
            </p>
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="distance"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar dataKey="hits" fill="var(--color-hits)" radius={4} />
            <Bar dataKey="misses" fill="var(--color-misses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <p className="mb-2 text-sm font-bold">Distance</p>
      {distanceWarning && (
        <p className="-mt-1 mb-2 text-xs text-orange-400">{distanceWarning}</p>
      )}
      <Select onValueChange={setSelectedDistance} value={selectedDistance}>
        <SelectTrigger className="mb-5 w-full">
          <SelectValue placeholder="Distance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4m</SelectItem>
          <SelectItem value="6">6m</SelectItem>
          <SelectItem value="8">8m</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {selectedDistance === 'custom' && (
        <div className="mb-5 flex gap-2">
          <Slider
            defaultValue={[10]}
            min={1}
            max={35}
            step={1}
            value={[customDistance]}
            onValueChange={(value) => setCustomDistance(value[0])}
          />
          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
            <NumberFlow value={customDistance} />m
          </Badge>
        </div>
      )}
      <p className="mb-2 text-sm font-bold">Recording</p>
      <Tabs defaultValue="byPutt">
        <TabsList className="h-auto w-full">
          <TabsTrigger value="byPutt" className="p-2">
            By Putt
          </TabsTrigger>
          <TabsTrigger value="byBatch" className="p-2">
            By Batch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="byPutt" className="flex flex-col gap-2">
          <Button
            color="primary"
            className="w-full p-6 font-bold"
            onClick={() => addHits(1)}
          >
            Hit
          </Button>
          <Button
            variant="outline"
            className="w-full p-6 font-bold"
            onClick={() => addMisses(1)}
          >
            Miss
          </Button>
        </TabsContent>
        <TabsContent value="byBatch" className="flex flex-col gap-2">
          <div className="mt-1">
            <Label htmlFor="batchPutts" className="mb-2">
              Total Putts
            </Label>
            <Input
              id="batchPutts"
              value={batchPutts}
              onChange={(e) => setBatchPutts(parseInt(e.target.value) || 0)}
              type="number"
              placeholder="Total amount of putts..."
              className="w-full px-4 py-6"
            />
          </div>
          <div className="mt-1">
            <Label htmlFor="batchHits" className="mb-2">
              Hits
            </Label>
            <Input
              id="batchHits"
              value={batchHits}
              onChange={(e) => setBatchHits(parseInt(e.target.value) || 0)}
              type="number"
              max={batchPutts}
              placeholder="Amount of hits..."
              className="w-full px-4 py-6"
            />
          </div>
          <Button
            color="primary"
            className="w-full p-6 font-bold"
            onClick={submitBatch}
            disabled={batchPutts === 0 || batchHits > batchPutts}
          >
            Save
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
