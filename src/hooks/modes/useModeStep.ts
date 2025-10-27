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
        index: undefined,
        step: undefined,
        session: null
      }
    }

    if (sessions.length === 0) {
      return {
        index: 0,
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
        index: mode.steps.length - 1,
        step: null,
        session: null
      }
    }

    if (sessions.length > mode.steps.length) {
      return {
        index: mode.steps.length - 1,
        step: null,
        session: null
      }
    }

    return {
      index: sessions.length - 1,
      step: mode.steps[sessions.length - 1],
      session: sessions.at(-1)
    }
  }, [sessions, mode.steps, isCurrentlyFinished])
}
