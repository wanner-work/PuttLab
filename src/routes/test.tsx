import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import connection from '@/data/connections/defaultConnection'
import { Putt } from '@/data/entities/putt'
import DataSource from '@/data/sources/PuttLabDataSource'
import getAllPutts from '@/methods/data/get/getAllSessions'
import { Capacitor } from '@capacitor/core'
import NumberFlow from '@number-flow/react'
import { SelectGroup } from '@radix-ui/react-select'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export const Route = createFileRoute('/test')({
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
  const { data: putts } = useQuery({
    queryKey: ['putts'],
    queryFn: getAllPutts
  })

  useEffect(() => {
    console.log('Fetched putts:', putts)

    if (putts) {
      const hits = putts.filter((p) => p.result === 'hit')
      const misses = putts.filter((p) => p.result === 'miss')

      setHits(hits as Putt[])
      setMisses(misses as Putt[])
    }
  }, [putts])

  const [batchAmount, setBatchAmount] = useState<number>(6)

  const [selectedDistance, setSelectedDistance] = useState<string>('4')
  const [customDistance, setCustomDistance] = useState<number>(10)
  const [hits, setHits] = useState<Putt[]>([])
  const [misses, setMisses] = useState<Putt[]>([])

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

  const addHits = async (amount: number = 1) => {
    const distance =
      selectedDistance === 'custom'
        ? customDistance
        : parseInt(selectedDistance || '0')

    for (let i = 0; i < amount; i++) {
      const putt = new Putt()
      putt.distance = distance
      putt.result = 'hit'
      putt.date = new Date().toISOString()
      setHits((prev) => [...prev, putt])

      const puttRepository = DataSource.getRepository(Putt)
      await puttRepository.save(putt)
    }

    const database = DataSource.options.database

    if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
      await connection.saveToStore(database)
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

  const addMisses = async (amount: number = 1) => {
    const distance =
      selectedDistance === 'custom'
        ? customDistance
        : parseInt(selectedDistance || '0')

    for (let i = 0; i < amount; i++) {
      const putt = new Putt()
      putt.distance = distance
      putt.result = 'miss'
      putt.date = new Date().toISOString()
      setMisses((prev) => [...prev, putt])

      const puttRepository = DataSource.getRepository(Putt)
      await puttRepository.save(putt)
    }

    const database = DataSource.options.database

    if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
      await connection.saveToStore(database)
    }
  }

  const submitBatch = (hits: number) => {
    addHits(hits)
    addMisses(batchAmount - hits)
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
          <SelectItem value="custom">Custom</SelectItem>

          <SelectGroup>
            <SelectLabel>Inside Bullseye</SelectLabel>
            <SelectItem value="2">2 meters</SelectItem>
            <SelectItem value="3">3 meters</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Inside Circle 1</SelectLabel>
            <SelectItem value="4">4 meters</SelectItem>
            <SelectItem value="6">6 meters</SelectItem>
            <SelectItem value="8">8 meters</SelectItem>
            <SelectItem value="10">10 meters</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Inside Circle 2</SelectLabel>
            <SelectItem value="12">12 meters</SelectItem>
            <SelectItem value="16">16 meters</SelectItem>
            <SelectItem value="20">20 meters</SelectItem>
          </SelectGroup>
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
          <div className="mt-2 flex gap-2">
            <Slider
              defaultValue={[10]}
              min={1}
              max={25}
              step={1}
              value={[batchAmount]}
              onValueChange={(value) => setBatchAmount(value[0])}
            />
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
              <NumberFlow value={batchAmount} /> throws
            </Badge>
          </div>
          <p className="text-sm text-neutral-500">
            Select how many of the {batchAmount} throws you hit
          </p>
          <div
            className="grid max-w-full gap-2"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(4rem, 1fr))`
            }}
          >
            {Array.from({ length: batchAmount }).map((_, index) => (
              <Button
                key={index}
                className="w-full p-5 font-mono text-lg font-bold"
                onClick={() => submitBatch(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
