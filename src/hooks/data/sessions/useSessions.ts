import QUERY from '@/constants/QUERY'
import getSessions from '@/methods/data/get/getSessions'
import { useQuery } from '@tanstack/react-query'

export default function useSessions() {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.ALL_SESSIONS],
    queryFn: () => getSessions()
  })

  return {
    sessions: query.data,
    ...query
  }
}
