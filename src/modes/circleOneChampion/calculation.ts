import type ModeCalculationParams from '@/interfaces/data/mode/ModeCalculationParams.ts'

export default function calculation({
  sessions
}: ModeCalculationParams): number {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0

  const weightForIndex = (i: number): number => {
    if (i < 3) return 0 // first 3 don't count
    if (i < 6) return 0.7 // next 3
    if (i < 10) return 0.9 // next 4
    if (i < 13) return 1 // next 3
    return 0.2 // all remaining
  }

  let weightedHits = 0
  let weightedAttempts = 0

  for (let i = 0; i < sessions.length; i++) {
    const { hits = 0, attempts = 0 } = sessions[i] as {
      hits?: number
      attempts?: number
    }
    if (attempts <= 0) continue
    const w = weightForIndex(i)
    if (w <= 0) continue
    weightedHits += hits * w
    weightedAttempts += attempts * w
  }

  if (weightedAttempts === 0) return 0

  const score = (weightedHits / weightedAttempts) * 100
  return Number(Math.max(0, Math.min(100, score)).toFixed(1))
}
