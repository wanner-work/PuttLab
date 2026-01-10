import QUERY from '@/constants/QUERY'
import getSessions from '@/methods/data/get/getSessions'
import { useQuery } from '@tanstack/react-query'

export default function useSessions(excludeModeRuns: boolean = true) {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions(null, excludeModeRuns)
  })

  return {
    sessions: query.data,
    ...query
  }
}
