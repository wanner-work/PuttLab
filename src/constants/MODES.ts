import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import circleOneChampionDefinition from '@/modes/circleOneChampion/circleOneChampionDefinition.ts'

const MODES = {
  DEFINITIONS: [circleOneChampionDefinition]
} satisfies {
  DEFINITIONS: ModeDefinition[]
}

export default MODES
