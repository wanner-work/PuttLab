import PageContainer from '@/components/basic/PageContainer'
import Step from '@/components/modes/run/Step'
import { Button } from '@/components/ui/button'
import QUERY from '@/constants/QUERY'
import useMode from '@/hooks/modes/useMode'
import getModeRun from '@/methods/data/create/getModeRun'
import NumberFlow from '@number-flow/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CircleOff, Slash } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/modes/$modeId/$modeRunId')({
  component: RouteComponent
})

function RouteComponent() {
  const mode = useMode(Route.useParams().modeId)

  const { data: modeRun } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.MODE_RUN, Route.useParams().modeRunId],
    queryFn: ({ queryKey }) => getModeRun(queryKey[1])
  })
  const stepIndex = useMemo(() => {
    if (!modeRun) return 0
    console.log('moderun', modeRun) // For debugging
    return modeRun.sessions?.length || 0
  }, [modeRun])

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back={`/modes/${mode?.id}`}
      actions={
        <>
          <div className="text-center">
            <p className="mt-1.5 text-xs font-bold text-neutral-400 uppercase">
              progress
            </p>
            <p className="flex items-center justify-center gap-2 font-mono text-lg font-bold">
              <NumberFlow value={modeRun?.sessions?.length ?? 1} />{' '}
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
      {modeRun && mode.steps[stepIndex] && (
        <Step
          step={mode.steps[stepIndex]}
          index={stepIndex}
          modeRun={modeRun}
          initialSession={modeRun?.sessions?.[stepIndex]}
          onComplete={() => {
            // Handle completion logic here
          }}
        />
      )}
    </PageContainer>
  )
}
