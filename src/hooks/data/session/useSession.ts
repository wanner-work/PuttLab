import QUERY from '@/constants/QUERY'
import getSession from '@/methods/data/get/getSession'
import { useQuery } from '@tanstack/react-query'

export default function useSession(sessionId: string) {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SESSION, sessionId],
    queryFn: ({ queryKey }) => getSession(queryKey[1])
  })

  return {
    ...query,
    session: query.data
  }
}
