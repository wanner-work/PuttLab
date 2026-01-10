import QUERY from '@/constants/QUERY'
import getModeRuns from '@/methods/data/get/getModeRuns'
import { useQuery } from '@tanstack/react-query'

export default function useModeRuns(mode: string) {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.MODE_RUN, mode],
    queryFn: ({ queryKey }) => getModeRuns(queryKey[1])
  })

  return {
    ...query,
    modeRuns: query.data
  }
}
