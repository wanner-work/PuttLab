import type { Session } from '@/data/entities/session.ts'
import useDistanceAverages from '@/hooks/data/stats/useDistanceAverages.ts'
import { useMemo } from 'react'

/**
 * Get average hit percentages for each distance in the sessions
 * @param sessions
 */
export default function useProjectedDistanceAverages(
  sessions: Session[] | undefined
) {
  const averages = useDistanceAverages(sessions)

  return useMemo(() => {
    if (!sessions || sessions.length === 0) return undefined
    if (!averages || averages.length === 0) return undefined

    const data: { distance: number; average: number; isProjected?: boolean }[] =
      []

    const longestDistance = Math.max(
      ...sessions.map((session) => Math.round(session.distance))
    )

    for (let distance = longestDistance; distance >= 2; distance--) {
      const existingAverage = averages.find((avg) => avg.distance === distance)
      if (existingAverage) {
        data.push(existingAverage)
      } else {
        // Find the next higher distance with an average
        const nextHigher = averages
          .filter((avg) => avg.distance > distance)
          .sort((a, b) => a.distance - b.distance)[0]
        // Find the next lower distance with an average
        const nextLower = averages
          .filter((avg) => avg.distance < distance)
          .sort((a, b) => b.distance - a.distance)[0]

        let projectedAverage = 0
        if (nextHigher && nextLower) {
          // Average the two
          projectedAverage = (nextHigher.average + nextLower.average) / 2
        } else if (nextHigher) {
          projectedAverage = nextHigher.average
        } else if (nextLower) {
          projectedAverage = nextLower.average
        }

        data.push({ distance, average: projectedAverage, isProjected: true })
      }
    }

    return data
  }, [sessions, averages])
}
