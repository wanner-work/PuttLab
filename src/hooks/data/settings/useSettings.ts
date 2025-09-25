import QUERY from '@/constants/QUERY'
import getSettings from '@/methods/data/get/getSettings'
import { useQuery } from '@tanstack/react-query'

export default function useSettings() {
  const query = useQuery({
    queryKey: [QUERY.CACHE_KEYS.SETTINGS],
    queryFn: getSettings
  })

  return {
    settings: query.data,
    ...query
  }
}
