import Header from '@/components/common/layout/Header'
import Layout from '@/components/common/layout/Layout'
import DeleteSessionDrawer from '@/components/sessions/actions/DeleteSessionDrawer'
import RecorderControl from '@/components/sessions/recorder/control/RecorderControl'
import RecorderHeader from '@/components/sessions/recorder/header/RecorderHeader'
import RecorderStats from '@/components/sessions/recorder/Stats/RecorderStats'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import useSession from '@/hooks/data/session/useSession'
import useSessionRecording from '@/hooks/sessions/useSessionRecording'
import NumberFlow from '@number-flow/react'
import { createFileRoute } from '@tanstack/react-router'
import { Slash, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)

  const navigate = Route.useNavigate()
  const { session } = useSession(sessionId)
  const { attempts, hits, history, onHit, onMiss, onBatch, onUndo } =
    useSessionRecording(session)

  const onDeleteSuccess = async () => {
    setDeleteDrawerOpen(false)

    await QUERY.CLIENT.invalidateQueries({
      queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS]
    })

    navigate({
      to: '/sessions',
      viewTransition: { types: ['slide-right'] },
      replace: true
    })
  }

  return (
    <Layout rows={['auto', '1fr', 'auto']}>
      <Header backTo="/sessions">
        <div className="text-center">
          <p className="mt-1.5 text-xs font-bold text-neutral-400 uppercase">
            attempts
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="font-mono text-lg font-bold">
              <NumberFlow value={attempts} />
            </p>
            {session?.maxAttempts && (
              <>
                <Slash className="size-2 text-neutral-500" />
                <p className="font-medium text-neutral-500">
                  <NumberFlow value={session.maxAttempts} />
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDrawerOpen(true)}
        >
          <Trash2 />
          Delete
        </Button>
      </Header>

      {session && (
        <DeleteSessionDrawer
          open={deleteDrawerOpen}
          sessionId={session.id}
          attempts={attempts}
          onOpenChange={setDeleteDrawerOpen}
          onSuccess={onDeleteSuccess}
        />
      )}

      <div className="flex flex-col justify-evenly overflow-auto pt-6">
        <RecorderHeader session={session} />
        <RecorderStats hits={hits} attempts={attempts} session={session} />
      </div>
      <RecorderControl
        session={session}
        attempts={attempts}
        history={history}
        hit={onHit}
        miss={onMiss}
        batch={onBatch}
        undo={onUndo}
      />
    </Layout>
  )
}
