import Header from '@/components/common/layout/Header'
import Headline from '@/components/common/layout/Headline'
import Layout from '@/components/common/layout/Layout'
import { Button } from '@/components/ui/button'
import useModeRunCreation from '@/hooks/data/mode/useModeRunCreation'
import useMode from '@/hooks/modes/useMode'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Loader, PlayIcon } from 'lucide-react'
import { memo } from 'react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/improved/modes/$modeId/')({
  component: memo(Modes)
})

function Modes() {
  const navigate = Route.useNavigate()

  const mode = useMode(Route.useParams().modeId)

  const { mutate: createModeRun, isPending } = useModeRunCreation(
    mode.id,
    (modeRun) => {
      navigate({
        to: '/improved/modes/$modeId/$modeRunId',
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
      <Header backTo="/improved/modes" />
      <Headline title={mode.name} subtitle={mode.description} />

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
