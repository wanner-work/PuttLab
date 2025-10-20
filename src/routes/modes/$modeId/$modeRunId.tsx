import PageContainer from '@/components/basic/PageContainer'
import StepIntroduction from '@/components/modes/run/StepIntroduction'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import useMode from '@/hooks/modes/useMode'
import useUnit from '@/hooks/units/useUnit'
import getModeRun from '@/methods/data/create/getModeRun'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CircleOff, Slash } from 'lucide-react'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/modes/$modeId/$modeRunId')({
  component: RouteComponent
})

function RouteComponent() {
  const { unit } = useUnit()

  const mode = useMode(Route.useParams().modeId)

  const { data: modeRun } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.MODE_RUN, Route.useParams().modeRunId],
    queryFn: ({ queryKey }) => getModeRun(queryKey[1])
  })

  const stepIndex = useMemo(() => {
    if (!modeRun) return 0
    return modeRun.sessions?.length || 0
  }, [modeRun])

  const step = useMemo(() => {
    if (!mode) return null
    return mode.steps[stepIndex] || null
  }, [stepIndex])

  useEffect(() => {
    if (modeRun && modeRun.sessions[stepIndex]) {
      console.log('Current session:', modeRun.sessions[stepIndex])
    } else {
      console.log('No current session, creating one')
    }
  }, [stepIndex])

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back="/sessions"
      actions={
        <>
          <div className="text-center">
            <p className="mt-1.5 text-xs font-bold text-neutral-400 uppercase">
              progress
            </p>
            <p className="flex items-center justify-center gap-2 font-mono text-lg font-bold">
              <NumberFlow value={modeRun?.sessions?.length ?? 0} />{' '}
              <Slash
                className="mb-1 inline-block size-3 text-neutral-500"
                strokeWidth={2}
              />{' '}
              <NumberFlow value={mode.steps.length} />
            </p>
          </div>

          <Button variant="destructive" size="sm">
            <CircleOff />
            Abort
          </Button>
        </>
      }
    >
      <div>
        {activeStep && (
          <StepIntroduction
            index={mode.steps.indexOf(activeStep)}
            step={activeStep}
          />
        )}

        <div className="text-center">
          <p className="mt-1.5 text-xs font-bold text-neutral-400 uppercase">
            Distance
          </p>
          <p className="font-mono text-[60px] font-bold">
            <NumberFlow value={activeStep?.distance || 0} /> {unit}
          </p>
        </div>

        <div className="text-center">
          <p className="mt-1.5 text-xs font-bold text-neutral-400 uppercase">
            Throws
          </p>
          <p className="font-mono text-[60px] font-bold">
            <NumberFlow value={activeStep?.repetitions || 0} />
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
