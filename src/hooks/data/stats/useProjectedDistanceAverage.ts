import type { Session } from '@/data/entities/session.ts'
import calculatePercentage from '@/methods/calculations/calculatePercentage.ts'
import { useMemo } from 'react'

export default function useProjectedDistanceAverage(
  sessions: Session[] | undefined
) {
  return useMemo(() => {
    if (!sessions || sessions.length === 0) return null

    const furthestDistance = sessions.reduce((max, session) => {
      return Math.max(session.distance, max)
    }, 0)

    const data: {
      distance: number
      average: number
    }[] = []

    for (let dist = furthestDistance; dist >= 2; dist--) {
      if (dist === 2) {
        data.push({
          distance: dist,
          average: 100
        })
        break
      }

      const filteredSessions = sessions.filter((s) => s.distance === dist)
      if (filteredSessions.length === 0) continue

      const attempts = filteredSessions.reduce((sum, s) => sum + s.attempts, 0)
      const hits = filteredSessions.reduce((sum, s) => sum + s.hits, 0)

      const average = calculatePercentage(attempts, hits)

      data.push({
        distance: dist,
        average
      })
    }

    return data
  }, [sessions])
}
