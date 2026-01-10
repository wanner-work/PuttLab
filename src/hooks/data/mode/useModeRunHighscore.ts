import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import type { ModeRunCalculated } from '@/interfaces/data/mode/ModeRunCalculated'
import { useMemo } from 'react'
import useModeRunsCalculated from './useModeRunsCalculated'

export default function useModeRunHighscore(
  mode: ModeDefinition,
  modeRuns: ModeRun[]
): ModeRunCalculated | undefined {
  const calculated = useModeRunsCalculated(mode, modeRuns, false)

  return useMemo(() => {
    if (!calculated || calculated.length === 0) return undefined
    calculated.sort((a, b) => b.score - a.score)
    return calculated[0]
  }, [calculated])
}
