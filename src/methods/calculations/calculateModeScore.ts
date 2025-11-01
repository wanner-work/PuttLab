import type { ModeRun } from '@/data/entities/moderun.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

export default function calculateModeScore(
  run: ModeRun,
  mode: ModeDefinition
): number {
  let attempts = 0
  let hits = 0

  for (const [index, session] of run.sessions.entries()) {
    const multiplier = mode.steps.at(index)?.scoreMultiplier ?? 1

    attempts += session.attempts * multiplier
    hits += session.hits * multiplier
  }

  return Number(((hits / attempts) * 100).toFixed(0))
}
