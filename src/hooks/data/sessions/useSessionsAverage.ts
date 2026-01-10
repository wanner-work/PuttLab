import type { Session } from '@/data/entities/session'
import { useMemo } from 'react'

export default function useSessionsAverage(sessions: Session[]) {
  const average = useMemo(() => {
    if (sessions.length === 0) {
      return 0
    }
    const totalAttempts = sessions.reduce(
      (acc, session) => acc + session.attempts,
      0
    )
    const totalHits = sessions.reduce((acc, session) => acc + session.hits, 0)

    return Math.floor(
      totalAttempts === 0 ? 0 : (totalHits / totalAttempts) * 100
    )
  }, [sessions])

  return average
}
