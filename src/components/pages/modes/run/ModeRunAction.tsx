import Grid from '@/components/common/layout/Grid'
import QUERY from '@/constants/QUERY'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useSessionCreation from '@/hooks/data/session/useSessionCreation'
import useModeStep from '@/hooks/modes/useModeStep.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'
import { useMemo, useState } from 'react'
import ModeRunActionHeader from './ModeRunActionHeader'
import ModeRunActionStep from './ModeRunActionStep'

interface Props {
  wasLoaded?: boolean
  mode: ModeDefinition
  modeRun: ModeRun
}

export default function ModeRunAction({ mode, modeRun }: Readonly<Props>) {
  const navigate = useNavigate()

  const [isCurrentlyFinished, setIsCurrentlyFinished] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(modeRun.sessions)

  const { mutate: createSession } = useSessionCreation((newSession) => {
    if (newSession) {
      setSessions((prev) => [...prev, newSession])
    }
  })

  const { step, index, session } = useModeStep(
    mode,
    sessions,
    isCurrentlyFinished
  )

  const isFinished = useMemo(() => {
    if (isCurrentlyFinished) return true
    if (sessions.length >= mode.steps.length) {
      const lastSession = sessions.at(-1)
      return lastSession
        ? lastSession.attempts >= lastSession.maxAttempts
        : false
    }
  }, [sessions, mode.steps.length, isCurrentlyFinished])

  const onNextStep = (updatedSession: Session) => {
    // update the session in the list to keep state in sync
    setSessions((prev) =>
      prev.map((session) =>
        session.id === updatedSession.id ? updatedSession : session
      )
    )

    QUERY.CLIENT.invalidateQueries({
      queryKey: [QUERY.CACHE_KEYS.MODE_RUN]
    })

    const nextStepIndex = sessions.length
    if (nextStepIndex >= mode.steps.length) {
      navigate({
        to: '/modes/$modeId/$modeRunId/result',
        params: {
          modeId: mode.id,
          modeRunId: String(modeRun.id)
        }
      })
      setIsCurrentlyFinished(true)
      return
    }

    const nextStep = mode.steps[nextStepIndex]

    createSession({
      modeRun,
      maxAttempts: nextStep.repetitions,
      distance: nextStep.distance
    })
  }

  return (
    <Grid
      rows={['auto', '1fr']}
      key="mode-run-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ModeRunActionHeader
        mode={mode}
        modeRun={modeRun}
        sessions={sessions}
        stepIndex={index || 0}
        isFinished={isFinished}
      />

      <AnimatePresence mode="wait">
        {step && session && (
          <ModeRunActionStep
            key={`mode-run-step-${session.id}`}
            step={step}
            mode={mode}
            modeRun={modeRun}
            session={session}
            onComplete={onNextStep}
          />
        )}
      </AnimatePresence>
    </Grid>
  )
}
