import { Button } from '@/components/ui/button'
import type { ModeRun } from '@/data/entities/moderun'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import NumberFlow from '@number-flow/react'
import { Link } from '@tanstack/react-router'
import { useDebounce } from '@uidotdev/usehooks'
import { MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  mode: ModeDefinition
  modeRun: ModeRun
}

export default function ModeRunFinish({ mode, modeRun }: Readonly<Props>) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    setScore(
      mode.calculateScore({
        modeRun,
        sessions: modeRun.sessions,
        mode
      })
    )
  }, [mode, modeRun])

  const debouncedScore = useDebounce(score, 500)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-xl font-bold text-neutral-400 uppercase">
        Final Score
      </p>
      <p className="font-mono text-3xl font-bold">
        <NumberFlow
          willChange
          value={debouncedScore || 0.0}
          transformTiming={{ duration: 2000, easing: 'ease-in-out' }}
          spinTiming={{ duration: 4000, easing: 'ease-in-out' }}
          opacityTiming={{ duration: 2000, easing: 'ease-in-out' }}
        />
      </p>

      <Link
        className="mt-8"
        to="/modes/$modeId"
        params={{ modeId: String(mode.id) }}
        viewTransition={{ types: ['slide-right'] }}
        replace
      >
        <Button>
          <MoveLeft />
          Go back
        </Button>
      </Link>
    </div>
  )
}
