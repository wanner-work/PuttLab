import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import NumberFlow from '@number-flow/react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Slash, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { RowComponentProps } from 'react-window'

interface Props {
  mode: ModeDefinition
  modeRuns: ModeRun[]
  onModeRunDelete: (modeRun: ModeRun) => void
}

export default function ModeRunListItem({
  mode,
  modeRuns,
  index,
  style,
  onModeRunDelete
}: RowComponentProps<Props>) {
  const modeRun = modeRuns[index]

  const [score, setScore] = useState<number>(0)

  const dnf = useMemo(() => {
    if (modeRun.sessions.length < mode.steps.length) {
      return true
    } else {
      const lastSession = modeRun.sessions.at(-1)
      return lastSession
        ? lastSession.attempts < lastSession.maxAttempts
        : false
    }
  }, [modeRun, mode.steps.length])

  const date = useMemo(() => {
    return dayjs(modeRun.date).fromNow()
  }, [modeRun.date])

  useEffect(() => {
    // could do this outside of useEffect but want fancy loading animation
    setScore(
      mode.calculateScore({
        modeRun,
        sessions: modeRun.sessions,
        mode
      })
    )
  }, [modeRun, mode])

  return (
    <div style={style} className="">
      <div
        className={clsx(
          'bg-card flex items-center justify-between rounded-3xl border px-5 py-4',
          dnf && 'bg-card/50 border/50'
        )}
      >
        <div className={clsx(dnf && 'opacity-50')}>
          <p className="mb-0 flex items-center gap-3 font-mono text-xs font-bold text-neutral-400 uppercase">
            # {modeRun.id} <Slash className="inline-block size-2" /> {date}
          </p>
          <p className="-mb-2 font-mono text-2xl font-bold">
            {dnf ? (
              <span className="block h-[36px]">DNF</span>
            ) : (
              <NumberFlow value={score} />
            )}
          </p>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onModeRunDelete(modeRun)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
