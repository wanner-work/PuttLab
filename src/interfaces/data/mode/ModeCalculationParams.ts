import type { ModeRun } from '@/data/entities/moderun.ts'
import type { Session } from '@/data/entities/session.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'

export default interface ModeCalculationParams {
  sessions: Session[]
  modeRun: ModeRun
  mode: ModeDefinition
}
