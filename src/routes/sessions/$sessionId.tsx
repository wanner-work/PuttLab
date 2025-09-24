import PageContainer from '@/components/basic/PageContainer.tsx'
import DeleteSessionDrawer from '@/components/sessions/DeleteSessionDrawer'
import RecorderControl from '@/components/sessions/recorder/control/RecorderControl.tsx'
import RecorderHeader from '@/components/sessions/recorder/header/RecorderHeader.tsx'
import RecorderStats from '@/components/sessions/recorder/Stats/RecorderStats.tsx'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import useHistory from '@/hooks/sessions/useHistory.ts'
import getSession from '@/methods/data/get/getSession'
import updateSession from '@/methods/data/update/updateSession'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useBlocker } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { Trash2 } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: memo(RecorderRoute)
})

function RecorderRoute() {
  const { sessionId } = Route.useParams()
  const navigate = Route.useNavigate()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const [hits, setHits] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const debouncedAttempts = useDebounce(attempts, 400)
  const debouncedHits = useDebounce(hits, 400)

  const {
    addHistoryEntry,
    getLastHistoryEntry,
    removeLastHistoryEntry,
    history
  } = useHistory()

  const { data: session } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  const { mutate } = useMutation({
    mutationFn: updateSession
  })

  const onHit = () => {
    setHits((h) => h + 1)
    setAttempts((a) => a + 1)

    addHistoryEntry(1, 1)
  }

  const onMiss = () => {
    setAttempts((a) => a + 1)

    addHistoryEntry(1, 0)
  }

  const onBatch = (attempts: number, hits: number) => {
    setHits((h) => h + hits)
    setAttempts((a) => a + attempts)

    addHistoryEntry(attempts, hits)
  }

  const onUndo = () => {
    Haptics.impact({ style: ImpactStyle.Medium }).then()

    const lastEntry = getLastHistoryEntry()

    setHits((h) => h - (lastEntry?.hits || 0))
    setAttempts((a) => a - (lastEntry?.attempts || 0))

    removeLastHistoryEntry()
  }

  useEffect(() => {
    if (session) {
      setHits(session.hits)
      setAttempts(session.attempts)
    }
  }, [session])

  /**
   * Auto-save session progress after debounce
   */
  useEffect(() => {
    if (!session) return
    if (debouncedAttempts === 0 && debouncedHits === 0) return
    if (debouncedAttempts === session.attempts) return

    session.attempts = debouncedAttempts
    session.hits = debouncedHits
    mutate(session)
  }, [debouncedAttempts, debouncedHits, session, mutate])

  /**
   * Because the recorder saves progress with debounce,
   * we need to block the navigation and save the progress first.
   * Once the progress is saved, we can allow the navigation.
   */
  useBlocker({
    shouldBlockFn: () => {
      if (!session) return false

      return new Promise<boolean>((resolve) => {
        session.attempts = attempts
        session.hits = hits

        if (
          debouncedAttempts === session.attempts &&
          debouncedHits === session.hits
        ) {
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId]
          })
          resolve(false)
        } else {
          mutate(session)
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId]
          })
          resolve(false)
        }
      })
    }
  })

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back="/sessions"
      actions={
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete
        </Button>
      }
    >
      <DeleteSessionDrawer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={async () => {
          await QUERY.CLIENT.invalidateQueries({
            queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
          })
          navigate({
            to: '/sessions',
            viewTransition: { types: ['slide-right'] }
          })
        }}
        sessionId={session ? session.id : 0}
        attempts={attempts}
      />
      <div className="flex flex-col justify-evenly overflow-auto pt-6">
        <RecorderHeader session={session} />
        <RecorderStats hits={hits} attempts={attempts} session={session} />
      </div>
      <RecorderControl
        session={session}
        history={history}
        hit={onHit}
        miss={onMiss}
        batch={onBatch}
        undo={onUndo}
      />
    </PageContainer>
  )
}
