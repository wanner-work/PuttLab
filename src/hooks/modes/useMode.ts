import MODES from '@/constants/MODES'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'

export default function useMode(modeId: string) {
  return MODES.DEFINITIONS.find((mode) => mode.id === modeId) as ModeDefinition
}
