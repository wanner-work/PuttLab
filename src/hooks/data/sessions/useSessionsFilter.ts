import QUERY from '@/constants/QUERY'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import getFilteredSessions from '@/methods/data/get/getFilteredSessions.tsx'
import { useQuery } from '@tanstack/react-query'

export default function useSessionsFilter(filter?: FilterValue) {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS, JSON.stringify(filter)],
    queryFn: () => {
      if (!filter) {
        return null
      }
      return getFilteredSessions(filter)
    }
  })

  return {
    sessions: query.data,
    ...query
  }
}
