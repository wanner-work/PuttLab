import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading'
import ModeRunAction from '@/components/pages/modes/run/ModeRunAction.tsx'
import useModeRun from '@/hooks/data/mode/useModeRun'
import useMode from '@/hooks/data/mode/useMode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modes/$modeId/$modeRunId')({
  component: ModeRun
})

function ModeRun() {
  const { modeRunId, modeId } = Route.useParams()

  const mode = useMode(modeId)
  const { modeRun, isLoading } = useModeRun(modeRunId)

  return (
    <Layout rows={['1fr']}>
      <AnimateLoading
        isLoading={isLoading || !modeRun}
        render={({ wasLoading }) => (
          <ModeRunAction
            wasLoaded={wasLoading}
            mode={mode}
            modeRun={modeRun!}
          />
        )}
      />
    </Layout>
  )
}
