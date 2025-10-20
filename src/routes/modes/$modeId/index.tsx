import PageContainer from '@/components/basic/PageContainer.tsx'
import { Button } from '@/components/ui/button'
import useMode from '@/hooks/modes/useMode'
import createModeRun from '@/methods/data/create/createModeRun'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2Icon, PlayIcon } from 'lucide-react'
import { memo } from 'react'

export const Route = createFileRoute('/modes/$modeId/')({
  component: memo(ModeRoute)
})

function ModeRoute() {
  const navigate = Route.useNavigate()

  const { modeId } = Route.useParams()
  const mode = useMode(modeId)

  const { mutate: create, isPending } = useMutation({
    mutationFn: () => createModeRun(modeId),
    onSuccess: (modeRun) => {
      navigate({
        to: '/modes/$modeId/$modeRunId',
        params: {
          modeId,
          modeRunId: String(modeRun.id)
        },
        viewTransition: { types: ['slide-right'] }
      })
    }
  })

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back="/modes"
      title={mode.name}
      subtitle={mode.description}
      actions={<></>}
    >
      <Button
        onClick={() => create()}
        disabled={isPending}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full font-bold"
      >
        {isPending && <Loader2Icon className="animate-spin" />}
        <PlayIcon strokeWidth={3} />
        Play now!
      </Button>
    </PageContainer>
  )
}
