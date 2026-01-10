import type { Session } from '@/data/entities/session.ts'
import useProjectedDistanceAverages from '@/hooks/data/stats/useProjectedDistanceAverages.ts'
import { useMemo } from 'react'

/**
 * Get average hit percentages for each distance in the sessions
 * @param sessions
 */
export default function useGuaranteedPutt(sessions: Session[] | undefined) {
  const projected = useProjectedDistanceAverages(sessions)

  return useMemo(() => {
    if (!sessions || sessions.length === 0) return undefined
    if (!projected || projected.length === 0) return undefined

    // Find the distance where the average is >= 80%
    const guaranteed = projected
      .filter((data) => data.average >= 80)
      .sort((a, b) => b.distance - a.distance)[0]

    return guaranteed?.distance
  }, [sessions, projected])
}
