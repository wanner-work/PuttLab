import type { Session } from '@/data/entities/session.ts'
import useUnit from '@/hooks/units/useUnit.ts'
import calculateCirclePosition from '@/methods/calculations/calculateCirclePosition.ts'
import NumberFlow from '@number-flow/react'
import { useMemo } from 'react'

interface Props {
  session?: null | Session
}

export default function RecorderHeader({ session }: Readonly<Props>) {
  const { getDistance, unit } = useUnit()

  const position = useMemo(() => {
    if (!session) return '...'
    return calculateCirclePosition(session.distance)
  }, [session])

  return (
    <div className="text-center">
      <p className="text-xs font-bold text-neutral-400 uppercase">{position}</p>
      <p className="font-mono text-2xl font-bold uppercase">
        <NumberFlow value={getDistance(session?.distance || 0)} /> {unit}
      </p>
    </div>
  )
}
