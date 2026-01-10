import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import circleOneChampionDefinition from '@/modes/champion/circleOneChampionDefinition.ts'
import circleTwoChampionDefinition from '@/modes/champion/circleTwoChampionDefinition.ts'
import calvinsTapInFocusDefinition from '@/modes/focus/calvinsTapInFocusDefinition.ts'
import dozenFocusDefinition from '@/modes/focus/dozenFocusDefinition.ts'
import tapInFocusDefinition from '@/modes/focus/tapInFocusDefinition.ts'
import tripleBullFocusDefinition from '@/modes/focus/tripleBullFocusDefinition.ts'

const MODES = {
  DEFINITIONS: [
    circleOneChampionDefinition,
    circleTwoChampionDefinition,
    tapInFocusDefinition,
    tripleBullFocusDefinition,
    dozenFocusDefinition,
    calvinsTapInFocusDefinition
  ]
} satisfies {
  DEFINITIONS: ModeDefinition[]
}

export default MODES
