import QUERY from '@/constants/QUERY'
import getModeRun from '@/methods/data/get/getModeRun'
import { useQuery } from '@tanstack/react-query'

export default function useModeRun(modeRunId: string) {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.MODE_RUN, modeRunId],
    queryFn: ({ queryKey }) => getModeRun(queryKey[1])
  })

  return {
    ...query,
    modeRun: query.data
  }
}
