import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import getModeScore from '@/methods/calculations/getModeScore.ts'
import NumberFlow from '@number-flow/react'
import { useEffect, useState } from 'react'

interface Props {
  mode: ModeDefinition
  modeRun: ModeRun
}

export default function ModeRunActionFinish({
  mode,
  modeRun
}: Readonly<Props>) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(getModeScore(modeRun, mode))
  }, [mode, modeRun])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-xl font-bold text-neutral-400 uppercase">
        Final Score
      </p>
      <p className="font-mono text-3xl font-bold">
        <NumberFlow
          willChange
          value={score || 0}
          transformTiming={{ duration: 1000, easing: 'ease-in-out' }}
          spinTiming={{ duration: 2000, easing: 'ease-in-out' }}
          opacityTiming={{ duration: 1000, easing: 'ease-in-out' }}
        />
      </p>
    </div>
  )
}
