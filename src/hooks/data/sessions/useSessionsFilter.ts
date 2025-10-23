import type { Session } from '@/data/entities/session'
import { useMemo } from 'react'

export default function useSessionsFilter(
  sessions: Session[],
  distanceFilter?: number | null
) {
  return useMemo(() => {
    return sessions.filter((session) => {
      if (!distanceFilter) return true
      return session.distance === distanceFilter
    })
  }, [sessions, distanceFilter])
}
