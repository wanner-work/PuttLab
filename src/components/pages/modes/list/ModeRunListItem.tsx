import { Card, CardContent } from '@/components/ui/card'
import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import NumberFlow from '@number-flow/react'
import { useEffect, useMemo, useState } from 'react'
import type { RowComponentProps } from 'react-window'

interface Props {
  mode: ModeDefinition
  modeRuns: ModeRun[]
}

export default function ModeRunListItem({
  mode,
  modeRuns,
  index,
  style
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
  }, [modeRun])

  useEffect(() => {
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
      <Card>
        <CardContent>
          <p className="mb-2 font-mono text-xs font-bold text-neutral-400">
            # {modeRun.id}
          </p>
          <p className="font-mono text-2xl font-bold">
            {dnf ? 'DNF' : <NumberFlow value={score} />}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
