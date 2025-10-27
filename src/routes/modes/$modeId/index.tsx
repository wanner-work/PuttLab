import EmptyDisplay from '@/components/common/empty/EmptyDisplay'
import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading'
import ModeDetail from '@/components/pages/modes/detail/ModeDetail'
import ModeRunList from '@/components/pages/modes/list/ModeRunList'
import { Button } from '@/components/ui/button'
import useModeRunCreation from '@/hooks/data/mode/useModeRunCreation'
import useModeRuns from '@/hooks/data/mode/useModeRuns'
import useMode from '@/hooks/modes/useMode'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Loader, PlayIcon } from 'lucide-react'
import { memo } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/modes/$modeId/')({
  component: memo(Modes)
})

function Modes() {
  const navigate = Route.useNavigate()

  const mode = useMode(Route.useParams().modeId)
  const { modeRuns, isLoading } = useModeRuns(mode.id)

  const { mutate: createModeRun, isPending } = useModeRunCreation(
    mode.id,
    (modeRun) => {
      navigate({
        to: '/modes/$modeId/$modeRunId',
        params: {
          modeId: mode.id,
          modeRunId: String(modeRun.id)
        },
        viewTransition: { types: ['slide-left'] }
      })
    }
  )

  return (
    <Layout rows={['auto', 'auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/modes" />
      <Headline title={mode.name} subtitle={mode.description} />

      <ModeDetail mode={mode} />

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

      <div className="fixed bottom-6 left-0 flex w-full justify-center">
        <Button
          disabled={isPending}
          onClick={() => createModeRun()}
          className="rounded-full"
        >
          {isPending ? <Loader className="animate-pulse" /> : <PlayIcon />}
          Play
        </Button>
      </div>
    </Layout>
  )
}
