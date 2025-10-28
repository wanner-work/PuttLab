import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import createModeRun from '@/methods/data/create/createModeRun'
import { useMutation } from '@tanstack/react-query'

export default function useModeRunCreation(
  mode: ModeDefinition,
  onSuccess?: (modeRun: ModeRun) => void
) {
  return useMutation({
    mutationFn: () => createModeRun(mode),
    onSuccess: (modeRun) => {
      onSuccess?.(modeRun)
    }
  })
}
