import deleteModeRun from '@/methods/data/delete/deleteModeRun'
import { useMutation } from '@tanstack/react-query'

export default function useModeRunDeletion(onSuccess?: () => void) {
  const query = useMutation({
    mutationFn: deleteModeRun,
    onSuccess: () => onSuccess?.()
  })

  return {
    ...query,
    remove: query.mutate
  }
}
