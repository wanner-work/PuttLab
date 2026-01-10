import Icon from '@/components/brand/Icon'
import AbortModeRunDrawer from '@/components/sessions/actions/AbortModeRunDrawer'
import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type { Session } from '@/data/entities/session.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import NumberFlow from '@number-flow/react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, CircleOff, Slash } from 'lucide-react'
import { useState } from 'react'

interface Props {
  mode: ModeDefinition
  modeRun: ModeRun
  sessions: Session[]
  stepIndex: number
  isFinished?: boolean
}

export default function ModeRunActionHeader({
  mode,
  modeRun,
  sessions,
  stepIndex,
  isFinished
}: Props) {
  const navigate = useNavigate()

  const [abortDrawerOpen, setAbortDrawerOpen] = useState(false)

  const onNavigate = () => {
    if (isFinished) {
      handleSuccess()
    } else {
      setAbortDrawerOpen(true)
    }
  }

  const onAbort = () => {
    setAbortDrawerOpen(true)
  }

  const handleSuccess = () => {
    navigate({
      to: '/modes/$modeId',
      params: { modeId: mode.id },
      viewTransition: {
        types: ['slide-right']
      }
    })
  }

  return (
    <>
      <AbortModeRunDrawer
        modeId={mode.id}
        modeRun={modeRun}
        sessions={sessions}
        open={abortDrawerOpen}
        onOpenChange={setAbortDrawerOpen}
        onSuccess={handleSuccess}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" onClick={onNavigate}>
          <div className="-ml-3 flex items-center justify-center p-3">
            <Button
              variant="link"
              className="!p-0 [view-transition-name:back-button]"
            >
              <ChevronLeft className="text-muted-foreground size-6" />
            </Button>
          </div>

          <div className="h-10 p-1.5">
            <Icon className="-ml-[22px] h-full w-auto" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          {!isFinished && (
            <>
              <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
                Step
              </p>
              <div className="-mb-1.5 flex items-center gap-2">
                <p className="font-mono text-lg font-bold">
                  <NumberFlow
                    value={
                      stepIndex !== undefined && stepIndex !== null
                        ? stepIndex + 1
                        : 0
                    }
                  />
                </p>
                <Slash className="size-2 text-neutral-500" />
                <p className="font-mono text-lg font-medium text-neutral-300">
                  <NumberFlow value={mode.steps.length} />
                </p>
              </div>
            </>
          )}
        </div>
        <div>
          {!isFinished && (
            <Button size="sm" variant="destructive" onClick={onAbort}>
              <CircleOff />
              Abort
            </Button>
          )}

          {isFinished && (
            <p className="font-mono text-lg font-bold text-neutral-500">
              # {modeRun.id}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
