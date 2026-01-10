import type { Session } from '@/data/entities/session.ts'
import { useMemo } from 'react'

/**
 * Get an array of all the distances from the sessions
 * @param sessions
 * @returns an array of distances in meters
 */
export default function useSessionDistances(sessions: Session[] | undefined) {
  return useMemo(() => {
    if (!sessions || sessions.length === 0) return undefined

    const distances: number[] = []

    for (const session of sessions) {
      const distance = Math.round(session.distance)
      if (!distances.includes(distance)) {
        distances.push(distance)
      }
    }

    distances.sort((a, b) => b - a)

    return distances
  }, [sessions])
}
