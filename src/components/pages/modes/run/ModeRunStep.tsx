import Screen from '@/components/common/layout/Screen.tsx'
import RecorderControl from '@/components/sessions/recorder/control/RecorderControl'
import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session'
import useSessionRecording from '@/hooks/sessions/useSessionRecording'
import useUnit from '@/hooks/units/useUnit'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import type ModeStep from '@/interfaces/data/mode/ModeStep'
import NumberFlow from '@number-flow/react'
import { CheckIcon, Slash } from 'lucide-react'

interface Props {
  step: ModeStep
  session: Session
  modeRun: ModeRun
  mode: ModeDefinition
  onComplete: (session: Session) => void
}

export default function ModeRunStep({ step, session, onComplete }: Props) {
  const { attempts, hits, history, onHit, onMiss, onBatch, onUndo } =
    useSessionRecording(session)

  const { getDistance, unit } = useUnit()

  const handleComplete = () => {
    session.attempts = attempts
    session.hits = hits

    onComplete(session)
  }

  return (
    <Screen
      key={`mode-run-step-${session.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      rows={['1fr', 'auto']}
    >
      <div className="flex flex-col justify-evenly overflow-auto pt-6">
        <div className="text-center">
          <p className="font-mono text-xl font-bold text-neutral-400 uppercase">
            <NumberFlow
              value={getDistance(session.distance)}
              suffix={' ' + unit}
            />
          </p>
          <p className="mt-8 mb-10 font-mono text-4xl font-bold uppercase">
            {step.label}
          </p>
          <p className="text-xs font-bold text-neutral-400 uppercase">
            Attempts
          </p>
          <div className="flex items-center justify-center gap-3 uppercase">
            <p className="text-lg font-bold text-white">
              <NumberFlow value={attempts} />
            </p>
            <Slash className="size-2 text-neutral-500" />
            <p className="font-medium text-neutral-400">
              <NumberFlow value={step.repetitions} />
            </p>
          </div>
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-96 items-center justify-around gap-3 px-4 text-center">
          <div className="w-32">
            <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
              Hits
            </p>
            <p className="font-mono text-6xl font-bold">
              <NumberFlow value={hits} />
            </p>
          </div>

          <div className="w-32">
            <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
              Misses
            </p>
            <p className="font-mono text-4xl font-bold">
              <NumberFlow value={attempts - hits} />
            </p>
          </div>
        </div>
      </div>
      <div>
        {attempts === step.repetitions && (
          <Button onClick={handleComplete} className="mb-4 w-full">
            Continue
            <CheckIcon strokeWidth={2} className="size-5" />
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
      </div>
    </Screen>
  )
}
