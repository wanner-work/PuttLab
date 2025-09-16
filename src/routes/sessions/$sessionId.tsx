import AverageCompare from '@/components/analytics/AverageCompare.tsx'
import PercentageChart from '@/components/analytics/PercentageChart'
import PageContainer from '@/components/basic/PageContainer.tsx'
import Recorder from '@/components/recorder/Recorder'
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
import QUERY from '@/constants/QUERY'
import calculateCirclePosition from '@/methods/calculations/calculateCirclePosition'
import deleteSession from '@/methods/data/delete/deleteSession'
import getSameDistanceSessions from '@/methods/data/get/getSameDistanceSessions'
import getSession from '@/methods/data/get/getSession'
import updateSession from '@/methods/data/update/updateSession'
import NumberFlow from '@number-flow/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { ChevronLeft, Loader2Icon, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const { mutate, isPending } = useMutation({
    mutationFn: updateSession
  })

  const navigate = Route.useNavigate()

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      QUERY.CLIENT.invalidateQueries({
        queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
      })
      void navigate({
        to: '/sessions'
      })
    }
  })

  const { data: session } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  const { data: sameDistanceSessions } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, session?.distance],
    queryFn: ({ queryKey }) => getSameDistanceSessions(Number(queryKey[1])),
    enabled: !!session
  })

  const totalAttempts = useMemo(() => {
    if (!session) return 0
    if (!sameDistanceSessions) return 0

    return (
      sameDistanceSessions
        .filter((s) => s.id !== session.id)
        .reduce((sum, session) => sum + session.attempts, 0) || 0
    )
  }, [sameDistanceSessions, session])

  const totalHits = useMemo(() => {
    if (!session) return 0
    if (!sameDistanceSessions) return 0

    return (
      sameDistanceSessions
        .filter((s) => s.id !== session.id)
        .reduce((sum, session) => sum + session.hits, 0) || 0
    )
  }, [sameDistanceSessions, session])

  const disabled = useMemo(() => {
    if (!session) return true
    if (session.maxAttempts) {
      return session.attempts >= session.maxAttempts
    }
  }, [session])

  const position = useMemo(() => {
    if (!session) return '...'
    return calculateCirclePosition(session.distance)
  }, [session])

  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const onHit = () => {
    setHits((h) => h + 1)
    setAttempts((a) => a + 1)
  }

  const onMiss = () => {
    setAttempts((a) => a + 1)
  }

  const onBatch = (attempts: number, hits: number) => {
    setHits((h) => h + hits)
    setAttempts((a) => a + attempts)
  }

  useEffect(() => {
    if (session) {
      setHits(session.hits)
      setAttempts(session.attempts)
    }
  }, [session])

  const debouncedAttempts = useDebounce(attempts, 500)
  const debouncedHits = useDebounce(hits, 500)

  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits
    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      actions={
        <div className="flex items-center justify-between gap-4">
          <Link to="/sessions">
            <Button size="sm" variant="outline">
              <ChevronLeft />
              Back
            </Button>
          </Link>
          <Drawer>
            <DrawerTrigger className="focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-5 py-2 font-medium whitespace-nowrap text-white shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <Trash2 />
              Delete
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Delete this session?</DrawerTitle>
                <DrawerDescription>
                  Are you sure you want to delete this session?{' '}
                  {attempts > 0 &&
                    `All ${attempts} recorded attempts will be lost.`}{' '}
                  <strong>This action cannot be undone.</strong>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="mx-4">
                <Button
                  onClick={() => remove(session!.id)}
                  disabled={isRemoving}
                  variant="destructive"
                >
                  {isRemoving && <Loader2Icon className="animate-spin" />}
                  Delete
                </Button>
                <DrawerClose>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      }
    >
      {isPending && (
        <div className="absolute top-0 right-0 m-4">
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
      <div className="flex flex-col gap-8 overflow-auto pt-8">
        <div className="text-center">
          <p className="text-xs font-bold text-neutral-400 uppercase">
            {position}
          </p>
          <p className="font-mono text-2xl font-bold uppercase">
            <NumberFlow value={session?.distance || 0} /> meter
          </p>
        </div>
        <div className="flex w-full items-center justify-around gap-3 px-4 text-center">
          <div className="w-32">
            <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
              Hits
            </p>
            <p className="font-mono text-6xl font-bold">
              <NumberFlow value={hits} />
            </p>
          </div>

          <div className="w-32">
            <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
              Misses
            </p>
            <p className="font-mono text-4xl font-bold">
              <NumberFlow value={attempts - hits} />
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          {totalAttempts > 0 && (
            <AverageCompare
              attempts={attempts}
              totalAttempts={totalAttempts}
              hits={hits}
              totalHits={totalHits}
            />
          )}
          <PercentageChart hits={hits} attempts={attempts} />
        </div>
      </div>
      <Recorder disabled={disabled} hit={onHit} miss={onMiss} batch={onBatch} />
    </PageContainer>
  )
}
