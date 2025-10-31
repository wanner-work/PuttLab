import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/modes/$modeId/$modeRunId/result')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/modes/$modeId/$modeRunId/result"!</div>
}
