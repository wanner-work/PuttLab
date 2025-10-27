import useUnit from '@/hooks/units/useUnit'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'

interface Props {
  mode: ModeDefinition
}

export default function ModeIntroduction({ mode }: Props) {
  const { requirements } = mode
  const { getDistance, unit } = useUnit()

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1 text-sm font-bold text-neutral-400 uppercase">
          Minimum Available distance
        </p>
        <p className="font-mono text-3xl font-bold uppercase">
          {getDistance(requirements.availableDistance)} {unit}
        </p>
      </div>
      <div>
        <p className="mb-1 text-sm font-bold text-neutral-400 uppercase">
          Approximate required time
        </p>
        <p className="font-mono text-3xl font-bold uppercase">
          {requirements.availableTime} minutes
        </p>
      </div>
      <div>
        <p className="mb-1 text-sm font-bold text-neutral-400 uppercase">
          Required putters
        </p>
        <p className="font-mono text-3xl font-bold uppercase">
          {requirements.availablePutters}{' '}
          {requirements.availablePutters === 1 ? 'putter' : 'putters'}
        </p>
      </div>
    </div>
  )
}
