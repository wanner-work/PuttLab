import type { Session } from '@/data/entities/session.ts'
import useSessionDistances from '@/hooks/data/stats/useSessionDistances.ts'
import getAverageForSessions from '@/methods/calculations/getAverageForSessions.ts'
import { useMemo } from 'react'

/**
 * Get average hit percentages for each distance in the sessions
 * @param sessions
 */
export default function useDistanceAverages(sessions: Session[] | undefined) {
  const distances = useSessionDistances(sessions)

  return useMemo(() => {
    if (!sessions || sessions.length === 0) return undefined
    if (!distances || distances.length === 0) return undefined

    const data: { distance: number; average: number }[] = []

    for (const distance of distances) {
      const filteredSessions = sessions.filter(
        (session) => Math.round(session.distance) === distance
      )
      if (filteredSessions.length === 0) continue

      const average = getAverageForSessions(filteredSessions)

      data.push({ distance, average })
    }

    return data
  }, [sessions, distances])
}
