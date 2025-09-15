import Recorder from '@/components/recorder/Recorder'
import QUERY from '@/constants/QUERY'
import getSession from '@/methods/data/get/getSession'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: RouteComponent
})

function RouteComponent() {
  const { sessionId } = Route.useParams()

  const { data: session } = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  const disabled = useMemo(() => {
    if (!session) return true
    if (session.maxAttempts) {
      return session.attempts >= session.maxAttempts
    }
  }, [session])

  return (
    <div
      className="grid h-dvh max-h-full p-6"
      style={{
        gridTemplateRows: 'minmax(0, 1fr) minmax(0, auto)'
      }}
    >
      <div>hello</div>
      <Recorder
        disabled={disabled}
        hit={() => {}}
        miss={() => {}}
        batch={(attempts, hits) => {}}
      />
    </div>
  )
}
