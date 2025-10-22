import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/improved/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/improved/sessions/$sessionId"!</div>
}
