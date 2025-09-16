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
import getAllSessions from '@/methods/data/get/getAllSessions'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, Loader2Icon, Plus } from 'lucide-react'
import { useState } from 'react'

import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

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
      <div className="mt-8 mb-20 flex flex-col gap-3">
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
        <DrawerTrigger className="fixed bottom-6 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-black px-5 py-4 font-bold text-white">
          <Plus />
          Create Session
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
