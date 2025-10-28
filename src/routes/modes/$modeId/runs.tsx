import EmptyDisplay from '@/components/common/empty/EmptyDisplay.tsx'
import Header from '@/components/common/layout/Header.tsx'
import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading.tsx'
import ModeHeadline from '@/components/pages/modes/detail/ModeHeadline.tsx'
import ModeRunList from '@/components/pages/modes/list/ModeRunList.tsx'
import useModeRuns from '@/hooks/data/mode/useModeRuns.ts'
import useMode from '@/hooks/modes/useMode.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modes/$modeId/runs')({
  component: ModeRuns
})

function ModeRuns() {
  const mode = useMode(Route.useParams().modeId)
  const { modeRuns, isLoading } = useModeRuns(mode.id)

  return (
    <Layout rows={['auto', 'auto', '1fr']} className="pb-0">
      <Header backTo={`/modes/${mode.id}`} />
      <ModeHeadline mode={mode} />

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
