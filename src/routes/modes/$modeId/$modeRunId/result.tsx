import Header from '@/components/common/layout/Header.tsx'
import Layout from '@/components/common/layout/Layout.tsx'
import AnimateLoading from '@/components/common/loading/AnimateLoading.tsx'
import ModeRunActionFinish from '@/components/pages/modes/run/ModeRunActionFinish.tsx'
import useMode from '@/hooks/data/mode/useMode.ts'
import useModeRun from '@/hooks/data/mode/useModeRun.ts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modes/$modeId/$modeRunId/result')({
  component: RouteComponent
})

function RouteComponent() {
  const { modeRunId, modeId } = Route.useParams()

  const mode = useMode(modeId)
  const { modeRun, isLoading } = useModeRun(modeRunId)

  return (
    <Layout rows={['auto', '1fr']}>
      <Header backTo={`/modes/${modeId}`} className="sticky top-6" />

      <AnimateLoading
        isLoading={!modeRun || isLoading}
        render={() => {
          return <ModeRunActionFinish mode={mode} modeRun={modeRun!} />
        }}
      />
    </Layout>
  )
}
