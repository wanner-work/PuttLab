import type { Session } from '@/data/entities/session'
import type { UseQueryResult } from '@tanstack/react-query'
import { use } from 'react'

export default function NewSessionList({
  query
}: {
  query: UseQueryResult<Session[]>
}) {
  const sessions = use(query.promise)

  return <div>{sessions.length} sessions loaded in NewSessionList</div>
}
