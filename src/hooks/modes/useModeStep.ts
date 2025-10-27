import type { Session } from '@/data/entities/session.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import { useMemo } from 'react'

export default function useModeStep(
  mode: ModeDefinition,
  sessions: Session[] | undefined,
  isCurrentlyFinished?: boolean
) {
  return useMemo(() => {
    if (!sessions) {
      return {
        step: undefined,
        session: null
      }
    }

    if (sessions.length === 0) {
      return {
        step: mode.steps[0],
        session: null
      }
    }

    if (
      isCurrentlyFinished ||
      (sessions.length === mode.steps.length &&
        sessions.at(-1)!.attempts >= sessions.at(-1)!.maxAttempts)
    ) {
      return {
        step: null,
        session: null
      }
    }

    if (sessions.length > mode.steps.length) {
      return {
        step: null,
        session: null
      }
    }

    return {
      step: mode.steps[sessions.length - 1],
      session: sessions.at(-1)
    }
  }, [sessions, mode.steps, isCurrentlyFinished])
}
