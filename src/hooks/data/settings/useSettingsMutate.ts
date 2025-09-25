import updateSettings from '@/methods/data/update/updateSettings'
import { useMutation } from '@tanstack/react-query'

export default function useSettingsMutate(onSuccess?: () => void) {
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      onSuccess?.()
    }
  })
}
