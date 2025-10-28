import EmptyDisplay from '@/components/common/empty/EmptyDisplay.tsx'
import Header from '@/components/common/layout/Header.tsx'
import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading.tsx'
import ModeRunList from '@/components/pages/modes/list/ModeRunList.tsx'
import DeleteDNFModeRunDrawer from '@/components/sessions/actions/DeleteDNFModeRunDrawer'
import { Button } from '@/components/ui/button'
import useMode from '@/hooks/data/mode/useMode'
import useModeRuns from '@/hooks/data/mode/useModeRuns.ts'
import isDNF from '@/methods/modes/isDNF'
import { createFileRoute } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/modes/$modeId/runs')({
  component: ModeRuns
})

function ModeRuns() {
  const mode = useMode(Route.useParams().modeId)
  const { modeRuns, isLoading } = useModeRuns(mode.id)

  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false)

  const dNFModeRuns = useMemo(() => {
    if (!modeRuns || modeRuns.length === 0) return []

    return modeRuns.filter((run) => isDNF(mode, run))
  }, [modeRuns, mode])

  const handleDeleteSuccess = () => {
    setDeleteDrawerOpen(false)
  }

  return (
    <Layout rows={['auto', '1fr']} className="pb-0">
      <Header backTo={`/modes/${mode.id}`} className="mb-8">
        <Button
          variant="destructive"
          size="sm"
          disabled={dNFModeRuns.length === 0}
          onClick={() => setDeleteDrawerOpen(true)}
        >
          <Trash2 />
          Delete all DNF
        </Button>
      </Header>

      {dNFModeRuns.length > 0 && (
        <DeleteDNFModeRunDrawer
          open={deleteDrawerOpen}
          onOpenChange={setDeleteDrawerOpen}
          modeId={mode.id}
          modeRuns={dNFModeRuns}
          onSuccess={handleDeleteSuccess}
        />
      )}

      <AnimateLoading
        isLoading={isLoading || !modeRuns}
        isEmpty={modeRuns?.length === 0}
        renderEmpty={() => (
          <EmptyDisplay
            className="pb-20"
            message="You haven't played this mode yet."
          />
        )}
        render={({ wasLoading }) => (
          <ModeRunList
            wasLoaded={wasLoading}
            modeRuns={modeRuns!}
            mode={mode}
          />
        )}
      />
    </Layout>
  )
}
