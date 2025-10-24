import type { ModeRun } from '@/data/entities/moderun'
import createModeRun from '@/methods/data/create/createModeRun'
import { useMutation } from '@tanstack/react-query'

export default function useModeRunCreation(
  modeId: string,
  onSuccess?: (modeRun: ModeRun) => void
) {
  return useMutation({
    mutationFn: () => createModeRun(modeId),
    onSuccess: (modeRun) => {
      onSuccess?.(modeRun)
    }
  })
}
