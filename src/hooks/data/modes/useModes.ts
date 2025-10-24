import MODES from '@/constants/MODES'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'

export default function useModes(): ModeDefinition[] {
  return MODES.DEFINITIONS
}
