import PercentageChart from '@/components/analytics/PercentageChart'
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
import { Loader2Icon, Plus } from 'lucide-react'
import { useState } from 'react'

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
      navigate({
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
    <>
      <div className="p-6">
        <h1 className="mt-6 text-3xl font-bold">Sessions</h1>
        <p className="text-muted-foreground">
          Here you can view and manage all your training sessions.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {sessions
            ?.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
            ?.map((session) => (
              <Link
                to="/sessions/$sessionId"
                params={{ sessionId: String(session.id) }}
                key={session.id}
                className={clsx(
                  'bg-background hover:bg-accent hover:text-accent-foreground gap-4 rounded-md border p-4 shadow-xs',
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
      </div>

      <Drawer>
        <DrawerTrigger>
          <Button className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full p-6 font-bold">
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
    </>
  )
}
