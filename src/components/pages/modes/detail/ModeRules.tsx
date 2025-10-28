import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useUnit from '@/hooks/units/useUnit.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import { useMemo } from 'react'

interface Props {
  mode: ModeDefinition
}

export default function ModeRules({ mode }: Props) {
  const { requirements } = mode
  const { getDistance, unit } = useUnit()

  const distances = useMemo(() => {
    const distances = new Set<number>()

    for (const step of mode.steps) {
      distances.add(step.distance)
    }

    return Array.from(distances).sort((a, b) => a - b)
  }, [mode])
  return (
    <div className="h-full overflow-auto pb-26">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle className="mt-1">Rules & Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <p className="mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Minimum Available distance
            </p>
            <p className="font-mono text-lg font-bold uppercase">
              {getDistance(requirements.availableDistance)} {unit}
            </p>
          </div>
          <div className="mb-3">
            <p className="mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Approximate required time
            </p>
            <p className="font-mono text-lg font-bold uppercase">
              ~ {requirements.availableTime} minutes
            </p>
          </div>
          <div className="">
            <p className="mb-0.5 text-xs font-bold text-neutral-400 uppercase">
              Maximum allowed putters
            </p>
            <p className="font-mono text-lg font-bold uppercase">
              {requirements.allowedPutters}{' '}
              {requirements.allowedPutters === 1 ? 'putter' : 'putters'}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="mt-1">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            It is recommended to mark the distances before starting the mode.
            This mode includes:{' '}
          </p>
          <ul className="text-sm">
            {distances.map((distance) => (
              <li key={distance} className="ml-4 list-disc">
                {getDistance(distance)} {unit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
