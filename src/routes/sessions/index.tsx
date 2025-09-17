import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import QUERY from '@/constants/QUERY'
import calculatePercentage from '@/methods/calculations/calculatePercentage'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronRight, PlusIcon, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import CreateSession from '@/components/sessions/CreateSession'
import { Card, CardContent } from '@/components/ui/card'
import getSessions from '@/methods/data/get/getSessions'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/sessions/')({
  component: Sessions
})

function Sessions() {
  const [createOpen, setCreateOpen] = useState(false)

  const navigate = Route.useNavigate()

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
      if (allSessions.length === 0) {
        return 'No sessions'
      }
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
      back="/"
    >
      <CreateSession
        open={createOpen}
        onOpenChange={setCreateOpen}
        navigate={navigate}
      />

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
              className="active:scale-[0.98]"
            >
              <Card className="py-3">
                <CardContent
                  className={clsx(
                    'gap-4 px-3',
                    session.attempts > 0 ? 'grid' : 'pl-4'
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
                      <p className="text-muted-foreground pr-2 font-mono font-bold">
                        {calculatePercentage(session.attempts, session.hits)}%
                      </p>
                    ) : (
                      <ChevronRight className="text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <Button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full font-bold"
        onClick={() => setCreateOpen(true)}
      >
        <PlusIcon strokeWidth={3} />
        Create Session
      </Button>
    </PageContainer>
  )
}
