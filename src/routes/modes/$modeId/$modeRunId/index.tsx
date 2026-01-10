import Layout from '@/components/common/layout/Layout'
import AnimateLoading from '@/components/common/loading/AnimateLoading'
import ModeRunAction from '@/components/pages/modes/run/ModeRunAction.tsx'
import useMode from '@/hooks/data/mode/useMode'
import useModeRun from '@/hooks/data/mode/useModeRun'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/modes/$modeId/$modeRunId/')({
  component: ModeRun
})

function ModeRun() {
  const { modeRunId, modeId } = Route.useParams()
  const navigate = Route.useNavigate()

  const mode = useMode(modeId)
  const { modeRun, isLoading } = useModeRun(modeRunId)

  useEffect(() => {
    let finished = false

    if (modeRun) {
      if (modeRun.sessions.length >= mode.steps.length) {
        const lastSession = modeRun.sessions.at(-1)
        finished = lastSession
          ? lastSession.attempts >= lastSession.maxAttempts
          : false
      }
    }

    if (finished) {
      navigate({
        to: '/modes/$modeId/$modeRunId/result',
        params: { modeId, modeRunId }
      })
    }
  }, [modeRun, navigate, modeId, modeRunId, mode.steps.length])

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
