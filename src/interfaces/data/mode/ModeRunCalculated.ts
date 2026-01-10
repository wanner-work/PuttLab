import type { ModeRun } from '@/data/entities/moderun'

export interface ModeRunCalculated extends ModeRun {
  score: number
  dnf: boolean
}
