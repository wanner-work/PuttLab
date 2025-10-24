import RecorderControl from '@/components/sessions/recorder/control/RecorderControl'
import RecorderHeader from '@/components/sessions/recorder/header/RecorderHeader'
import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useSessionRecording from '@/hooks/sessions/useSessionRecording'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import type ModeStep from '@/interfaces/data/mode/ModeStep'
import { motion } from 'motion/react'

interface Props {
  step: ModeStep
  session: Session
  modeRun: ModeRun
  mode: ModeDefinition
  onComplete: () => void
}

export default function ModeRunStep({ step, session, onComplete }: Props) {
  const { attempts, history, onHit, onMiss, onBatch, onUndo } =
    useSessionRecording(session)

  return (
    <motion.div
      key={`mode-run-step-${session.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col justify-evenly overflow-auto pt-6">
        <RecorderHeader session={session} />
        {step.repetitions} / {attempts} / {session.attempts} /{' '}
        {session.maxAttempts}
      </div>
      {attempts === step.repetitions && (
        <Button onClick={onComplete} className="m-6">
          Complete Step
        </Button>
      )}
      <RecorderControl
        session={session}
        attempts={attempts}
        history={history}
        hit={onHit}
        miss={onMiss}
        batch={onBatch}
        undo={onUndo}
      />
    </motion.div>
  )
}
