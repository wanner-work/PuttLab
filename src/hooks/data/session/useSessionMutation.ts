import QUERY from '@/constants/QUERY'
import updateSession from '@/methods/data/update/updateSession'
import { useMutation } from '@tanstack/react-query'

export default function useSessionMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      QUERY.CLIENT.invalidateQueries({ queryKey: [QUERY.CACHE_KEYS.SETTINGS] })
      onSuccess?.()
    }
  })
}
