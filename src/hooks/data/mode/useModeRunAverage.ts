import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { useMemo } from 'react'
import useModeRunsCalculated from './useModeRunsCalculated'

export default function useModeRunAverage(
  mode: ModeDefinition,
  modeRuns: ModeRun[]
): number | undefined {
  const calculated = useModeRunsCalculated(mode, modeRuns, false)

  return useMemo(() => {
    if (!calculated || calculated.length === 0) return undefined
    const total = calculated.reduce((sum, run) => sum + run.score, 0)
    return Number(Math.floor(total / calculated.length).toFixed(1))
  }, [calculated])
}
