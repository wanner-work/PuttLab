import Screen from '@/components/common/layout/Screen.tsx'
import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useSessionCreation from '@/hooks/data/session/useSessionCreation'
import useModeStep from '@/hooks/modes/useModeStep.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import ModeRunStep from './ModeRunStep'

interface Props {
  wasLoaded?: boolean
  mode: ModeDefinition
  modeRun: ModeRun
}

export default function ModeRunAction({ mode, modeRun }: Readonly<Props>) {
  const [sessions, setSessions] = useState<Session[]>(modeRun.sessions)

  const { mutate: createSession } = useSessionCreation((newSession) => {
    if (newSession) {
      setSessions((prev) => [...prev, newSession])
    }
  })

  const { step, session } = useModeStep(mode, sessions)

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
    <Screen
      rows={['auto', '1fr']}
      key="mode-run-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div></div>

      {sessions.length === 0 && (
        <div className="flex items-center justify-center">
          <Button onClick={onStartStep}>Let's Go!</Button>
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
    </Screen>
  )
}
