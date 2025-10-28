import Header from '@/components/common/layout/Header'
import Layout from '@/components/common/layout/Layout'
import ModeHeadline from '@/components/pages/modes/detail/ModeHeadline.tsx'
import ModeRules from '@/components/pages/modes/detail/ModeRules.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button'
import useModeRunCreation from '@/hooks/data/mode/useModeRunCreation'
import useModeRuns from '@/hooks/data/mode/useModeRuns'
import useMode from '@/hooks/modes/useMode'
import NumberFlow from '@number-flow/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Layers, Loader, PlayIcon } from 'lucide-react'
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
    mode,
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
    <Layout rows={['auto', 'auto', '1fr']} className="pb-0">
      <Header backTo="/modes" />
      <ModeHeadline mode={mode} />

      <ModeRules mode={mode} />

      <div className="fixed bottom-6 left-0 flex w-full justify-center">
        <Link
          to="/modes/$modeId/runs"
          params={{ modeId: mode.id }}
          viewTransition={{
            types: ['slide-left']
          }}
        >
          <Button
            disabled={isLoading}
            variant="secondary"
            className="mr-4 rounded-full font-bold"
          >
            <Layers strokeWidth={3} />
            <span>Runs</span>
            {modeRuns && modeRuns.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 rounded-full px-1 font-mono">
                <NumberFlow value={modeRuns?.length} />
              </Badge>
            )}
          </Button>
        </Link>
        <Button
          disabled={isPending}
          onClick={() => createModeRun()}
          className="rounded-full font-bold"
        >
          {isPending ? (
            <Loader className="animate-pulse" />
          ) : (
            <PlayIcon fill="black" />
          )}
        </Button>
      </div>
    </Layout>
  )
}
