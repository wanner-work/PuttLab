import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import type { ModeRunCalculated } from '@/interfaces/data/mode/ModeRunCalculated'
import isDNF from '@/methods/modes/isDNF'
import { useMemo } from 'react'

export default function useModeRunsCalculated(
  mode: ModeDefinition,
  modeRuns: ModeRun[],
  includeDNF: boolean = false
): ModeRunCalculated[] {
  return useMemo(() => {
    if (!modeRuns || modeRuns.length === 0) return []

    const calculated = modeRuns.map((run) => {
      return {
        ...run,
        score: mode.calculateScore({
          mode,
          modeRun: run,
          sessions: run.sessions
        }),
        dnf: isDNF(mode, run)
      }
    })

    if (!includeDNF) {
      return calculated.filter((run) => !run.dnf)
    }

    return calculated
  }, [mode, modeRuns, includeDNF])
}
