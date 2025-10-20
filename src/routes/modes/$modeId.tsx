import PageContainer from '@/components/basic/PageContainer.tsx'
import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'

export const Route = createFileRoute('/modes/$modeId')({
  component: memo(ModeRoute)
})

function ModeRoute() {
  const { modeId } = Route.useParams()

  return (
    <PageContainer
      className="grid h-dvh max-h-full"
      style={{
        gridTemplateRows: 'minmax(0, auto) minmax(0, 1fr) minmax(0, auto)'
      }}
      back="/modes"
      actions={<></>}
    >
      {modeId}
    </PageContainer>
  )
}
