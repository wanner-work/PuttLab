import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, Loader2Icon, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import getSessions from '@/methods/data/get/getSessions'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/sessions/')({
  component: Sessions
})

function Sessions() {
  const navigate = useNavigate({ from: Route.fullPath })

  const [distanceFilter, setDistanceFilter] = useState<string | undefined>(
    undefined
  )

  const { data: allSessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions()
  })

  const { data: sessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, distanceFilter ?? 'all'],
    queryFn: ({ queryKey }) => {
      const distance = queryKey[1]
      if (distance === 'all') {
        return getSessions()
      }
      return getSessions(Number(distance))
    }
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

  const optionsBullseye = useMemo(() => {
    return allSessions
      ?.filter((s) => s.distance <= 3)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [allSessions])

  const optionsCircleOne = useMemo(() => {
    return allSessions
      ?.filter((s) => s.distance <= 10 && s.distance > 3)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [allSessions])

  const optionsCircleTwo = useMemo(() => {
    return allSessions
      ?.filter((s) => s.distance <= 20 && s.distance > 10)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [allSessions])

  const optionsOutsideCircle = useMemo(() => {
    return allSessions
      ?.filter((s) => s.distance > 20)
      .map((s) => s.distance)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
  }, [allSessions])

  const amount = useMemo(() => {
    if (allSessions === undefined) {
      return ''
    }

    if (distanceFilter === undefined) {
      return `${allSessions.length > 1 ? allSessions.length : 'one'} ${allSessions.length === 1 ? 'session' : 'sessions'}`
    } else if (sessions !== undefined) {
      return `${sessions.length > 1 ? sessions.length : 'one'} ${sessions.length === 1 ? 'session' : 'sessions'} for ${distanceFilter} meter`
    }
  }, [sessions, allSessions, distanceFilter])

  const selectedAverage = useMemo(() => {
    if (sessions === undefined || sessions.length === 0) {
      return 0
    }
    const totalAttempts = sessions.reduce(
      (sum, session) => sum + session.attempts,
      0
    )
    const totalHits = sessions.reduce((sum, session) => sum + session.hits, 0)

    return calculatePercentage(totalAttempts, totalHits)
  }, [sessions])

  return (
    <PageContainer
      title="Sessions"
      subtitle="Manage your training sessions"
      actions={
        <div className="flex items-center justify-between gap-4">
          <Link to="/">
            <Button size="sm" variant="outline">
              <ChevronLeft />
              Back
            </Button>
          </Link>
        </div>
      }
    >
      <div className="flex gap-3">
        <Select
          value={distanceFilter ?? ''}
          onValueChange={(value) => setDistanceFilter(value || undefined)}
        >
          <SelectTrigger id="distance" className="w-full">
            <SelectValue placeholder="Filter for distance" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bullseye</SelectLabel>
              {optionsBullseye && optionsBullseye.length > 0 ? (
                optionsBullseye.map((distance) => (
                  <SelectItem key={distance} value={String(distance)}>
                    {distance} meters
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="undefined" disabled>
                  No sessions with this distance yet
                </SelectItem>
              )}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Circle 1</SelectLabel>
              {optionsCircleOne && optionsCircleOne.length > 0 ? (
                optionsCircleOne.map((distance) => (
                  <SelectItem key={distance} value={String(distance)}>
                    {distance} meters
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="undefined" disabled>
                  No sessions with this distance yet
                </SelectItem>
              )}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Circle 2</SelectLabel>
              {optionsCircleTwo && optionsCircleTwo.length > 0 ? (
                optionsCircleTwo.map((distance) => (
                  <SelectItem key={distance} value={String(distance)}>
                    {distance} meters
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="undefined" disabled>
                  No sessions with this distance yet
                </SelectItem>
              )}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Outside Circle</SelectLabel>
              {optionsOutsideCircle && optionsOutsideCircle.length > 0 ? (
                optionsOutsideCircle.map((distance) => (
                  <SelectItem key={distance} value={String(distance)}>
                    {distance} meters
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="undefined" disabled>
                  No sessions with this distance yet
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {distanceFilter && (
          <Button
            variant="outline"
            onClick={() => setDistanceFilter(undefined)}
          >
            <X />
          </Button>
        )}
      </div>
      <div className="my-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm uppercase">{amount}</p>
        <p className="text-muted-foreground font-mono text-sm font-bold">
          <NumberFlow value={selectedAverage} suffix="%" />
        </p>
      </div>
      <div className="mb-20 flex flex-col gap-3">
        {sessions
          ?.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
          ?.map((session, index) => (
            <Link
              to="/sessions/$sessionId"
              params={{ sessionId: String(session.id) }}
              key={session.id}
              className={clsx(
                'bg-background hover:bg-accent hover:text-accent-foreground gap-4 rounded-xl border p-4 shadow',
                session.attempts > 0 && 'grid'
              )}
              style={{
                gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)'
              }}
            >
              {session.attempts > 0 && (
                <div className="self-center">
                  <PercentageChart
                    index={index}
                    hits={session.hits}
                    attempts={session.attempts}
                    size="sm"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-bold uppercase">
                    {session.distance} meter
                  </p>
                  <p className="text-sm text-neutral-400">
                    {dayjs().to(dayjs(session.date))}
                  </p>
                </div>
                {session.attempts > 0 ? (
                  <p className="pr-2 font-mono font-bold text-black/60">
                    {calculatePercentage(session.attempts, session.hits)}%
                  </p>
                ) : (
                  <ChevronRight className="text-muted-foreground" />
                )}
              </div>
            </Link>
          ))}
      </div>

      <Drawer>
        <DrawerTrigger className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <Button className="rounded-full">
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
            <DrawerClose asChild>
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
