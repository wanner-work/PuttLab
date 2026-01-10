import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'

export default function isDNF(mode: ModeDefinition, modeRun: ModeRun): boolean {
  if (modeRun.sessions.length < mode.steps.length) {
    return true
  }

  const lastSession = modeRun.sessions.at(-1)
  return lastSession ? lastSession.attempts < lastSession.maxAttempts : false
}
