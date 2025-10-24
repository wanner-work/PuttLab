import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useSessionCreation from '@/hooks/data/session/useSessionCreation'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import ModeRunStep from './ModeRunStep'

interface Props {
  wasLoaded?: boolean
  mode: ModeDefinition
  modeRun: ModeRun
}

export default function ModeRunDisplay({ mode, modeRun }: Props) {
  const [sessions, setSessions] = useState<Session[]>(modeRun.sessions)

  const { mutate: createSession } = useSessionCreation((newSession) => {
    if (newSession) {
      setSessions((prev) => [...prev, newSession])
    }
  })

  const { step, session } = useMemo(() => {
    if (sessions.length === 0) {
      return {
        step: mode.steps[0],
        session: null
      }
    }

    if (sessions.length >= mode.steps.length) {
      return {
        step: null,
        session: null
      }
    }

    console.log('sessions.length', sessions.length)

    console.log('getting step and session for index', sessions.length - 1)

    console.log('steps', sessions)
    console.log('steps', mode.steps)
    console.log('step complete', mode.steps[sessions.length - 1])

    console.log(
      'step',
      mode.steps[sessions.length - 1].repetitions,
      mode.steps[sessions.length - 1].distance
    )
    console.log(
      'session',
      sessions[sessions.length - 1].maxAttempts,
      sessions[sessions.length - 1].distance
    )

    return {
      step: mode.steps[sessions.length - 1],
      session: sessions[sessions.length - 1]
    }
  }, [sessions, mode.steps])

  const onStartStep = () => {
    const firstStep = mode.steps[0]

    createSession({
      modeRun,
      maxAttempts: firstStep.repetitions,
      distance: firstStep.distance
    })
  }

  const onNextStep = () => {
    const nextStepIndex = sessions.length
    if (nextStepIndex >= mode.steps.length) return

    const nextStep = mode.steps[nextStepIndex]

    createSession({
      modeRun,
      maxAttempts: nextStep.repetitions,
      distance: nextStep.distance
    })
  }

  return (
    <motion.div
      key="mode-run-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>Mode: {mode.name}</h2>
      <h3>Mode Run: {modeRun.id}</h3>
      <p>Sessions: {sessions.length}</p>
      <h4>Current Step: {step ? step.label : 'Completed'}</h4>

      {sessions.length === 0 && (
        <div>
          Ready?
          <Button onClick={onStartStep} variant="outline">
            Let's Go!
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step && session && (
          <ModeRunStep
            step={step}
            mode={mode}
            modeRun={modeRun}
            session={session}
            onComplete={onNextStep}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
