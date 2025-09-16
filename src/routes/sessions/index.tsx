import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import QUERY from '@/constants/QUERY'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import createSession from '@/methods/data/create/createSession'
import getAllSessions from '@/methods/data/get/getAllSessions'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Loader2Icon, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'

export const Route = createFileRoute('/sessions/')({
  component: Sessions
})

function Sessions() {
  const navigate = useNavigate({ from: Route.fullPath })

  const { data: sessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: getAllSessions
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void navigate({
        to: '/sessions/$sessionId',
        params: { sessionId: String(session.id) }
      })
    }
  })

  const [selectedDistance, setSelectedDistance] = useState<string>('8')
  const [customDistance, setCustomDistance] = useState<number>(10)

  const create = () => {
    const distance =
      selectedDistance === 'custom' ? customDistance : Number(selectedDistance)

    mutate(distance)
  }

  const {
    bullseyeAverage,
    circleOneAverage,
    circleTwoAverage,
    outsideAverage
  } = useMemo(() => {
    const bullseyeSessions = sessions?.filter((s) => s.distance <= 3) || []
    const circleOneSessions =
      sessions?.filter((s) => s.distance > 3 && s.distance <= 10) || []
    const circleTwoSessions =
      sessions?.filter((s) => s.distance > 10 && s.distance <= 20) || []
    const outsideSessions = sessions?.filter((s) => s.distance > 20) || []

    const bullseyeAverage = calculatePercentage(
      bullseyeSessions.reduce((sum, session) => sum + session.attempts, 0),
      bullseyeSessions.reduce((sum, session) => sum + session.hits, 0)
    )

    const circleOneAverage = calculatePercentage(
      circleOneSessions.reduce((sum, session) => sum + session.attempts, 0),
      circleOneSessions.reduce((sum, session) => sum + session.hits, 0)
    )

    const circleTwoAverage = calculatePercentage(
      circleTwoSessions.reduce((sum, session) => sum + session.attempts, 0),
      circleTwoSessions.reduce((sum, session) => sum + session.hits, 0)
    )

    const outsideAverage = calculatePercentage(
      outsideSessions.reduce((sum, session) => sum + session.attempts, 0),
      outsideSessions.reduce((sum, session) => sum + session.hits, 0)
    )

    return {
      bullseyeAverage,
      circleOneAverage,
      circleTwoAverage,
      outsideAverage
    }
  }, [sessions])

  const chartData = useMemo(() => {
    return [
      {
        position: 'bullseye',
        average: bullseyeAverage,
        fill: 'var(--chart-1)'
      },
      {
        position: 'one',
        average: circleOneAverage,
        fill: 'var(--chart-2)'
      },
      {
        position: 'two',
        average: circleTwoAverage,
        fill: 'var(--chart-3)'
      },
      { position: 'outside', average: outsideAverage, fill: 'var(--chart-4)' }
    ]
  }, [bullseyeAverage, circleOneAverage, circleTwoAverage, outsideAverage])

  const chartConfig = useMemo(() => {
    return {
      position: {
        label: 'Position'
      },
      bullseye: {
        label: 'Bullseye'
      },
      one: {
        label: 'Circle One'
      },
      two: {
        label: 'Circle Two'
      },
      outside: {
        label: 'Outside'
      }
    } satisfies ChartConfig
  }, [])

  return (
    <PageContainer title="Sessions" subtitle="Manage your training sessions">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Your stats over all sessions.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4 pb-0">
          <div className="shrink-0">
            <div>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Bullseye
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={bullseyeAverage} />%
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                C1X
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={circleOneAverage} />%
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                C2X
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={circleTwoAverage} />%
              </p>
            </div>
            <div className="mt-2">
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Outside
              </p>
              <p className="font-mono text-xl font-bold">
                <NumberFlow value={outsideAverage} />%
              </p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="size-[180px]">
            <RadialBarChart data={chartData} innerRadius={20} outerRadius={100}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent nameKey="position" hideLabel />}
              />
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                dataKey="average"
                angleAxisId={0}
                tick={false}
              />
              <RadialBar dataKey="average" background angleAxisId={0} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="mt-8 mb-16 flex flex-col gap-4">
        {sessions
          ?.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
          ?.map((session) => (
            <Link
              to="/sessions/$sessionId"
              params={{ sessionId: String(session.id) }}
              key={session.id}
              className={clsx(
                'bg-background hover:bg-accent hover:text-accent-foreground gap-4 rounded-lg border p-4 shadow-md',
                session.attempts > 0 && 'grid'
              )}
              style={{
                gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)'
              }}
            >
              {session.attempts > 0 && (
                <div className="self-center">
                  <PercentageChart
                    hits={session.hits}
                    attempts={session.attempts}
                    size="sm"
                  />
                </div>
              )}
              <div className="">
                <p>{session.distance} meters</p>
                <p className="text-sm text-neutral-400">
                  {dayjs(session.date).format('MM.DD.YYYY - HH:mm')}
                </p>

                <div className="mt-2 grid grid-cols-3">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">
                      Attempts
                    </p>
                    <p className="text-sm">{session.attempts}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">
                      Hits
                    </p>
                    <p className="text-sm">{session.hits}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">
                      Average
                    </p>
                    <p className="text-sm">
                      {calculatePercentage(session.attempts, session.hits)}%
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <Drawer>
        <DrawerTrigger>
          <Button className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full font-bold">
            <Plus />
            Create Session
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create a new training session</DrawerTitle>
            <DrawerDescription>Define the distance.</DrawerDescription>
          </DrawerHeader>
          <div className="mx-4 my-4 px-4">
            <Select
              onValueChange={setSelectedDistance}
              value={selectedDistance}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>

                <SelectGroup>
                  <SelectLabel>Bullseye</SelectLabel>
                  <SelectItem value="2">2 meters</SelectItem>
                  <SelectItem value="3">3 meters</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Circle 1</SelectLabel>
                  <SelectItem value="4">4 meters</SelectItem>
                  <SelectItem value="6">6 meters</SelectItem>
                  <SelectItem value="8">8 meters</SelectItem>
                  <SelectItem value="10">10 meters</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Circle 2</SelectLabel>
                  <SelectItem value="12">12 meters</SelectItem>
                  <SelectItem value="16">16 meters</SelectItem>
                  <SelectItem value="20">20 meters</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedDistance === 'custom' && (
              <div className="mt-5 flex gap-2">
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
          </div>
          <DrawerFooter className="mx-4">
            <Button onClick={create} disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin" />}
              Create
            </Button>
            <DrawerClose>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </PageContainer>
  )
}
