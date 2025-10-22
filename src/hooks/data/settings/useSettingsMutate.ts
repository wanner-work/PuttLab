import QUERY from '@/constants/QUERY'
import updateSettings from '@/methods/data/update/updateSettings'
import { useMutation } from '@tanstack/react-query'

export default function useSettingsMutate(onSuccess?: () => void) {
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      QUERY.CLIENT.invalidateQueries({ queryKey: [QUERY.CACHE_KEYS.SETTINGS] })
      onSuccess?.()
    }
  })
}
