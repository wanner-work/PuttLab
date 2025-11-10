import type { Session } from '@/data/entities/session'
import getPercentage from './getPercentage.ts'

export default function getAverageForSessions(sessions: Session[]) {
  if (sessions.length === 0) return 0

  const totalAttempts = sessions.reduce(
    (sum, session) => sum + session.attempts,
    0
  )
  const totalHits = sessions.reduce((sum, session) => sum + session.hits, 0)

  if (totalAttempts === 0) return 0

  return getPercentage(totalAttempts, totalHits)
}
