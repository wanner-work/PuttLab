import calculatePercentage from '@/methods/calculations/calculatePercentage.ts'
import NumberFlow from '@number-flow/react'
import { memo, useMemo } from 'react'

interface Props {
  hits: number
  attempts: number
  totalHits: number
  totalAttempts: number
}

export default memo(AverageCompare)

function AverageCompare({
  hits,
  attempts,
  totalHits,
  totalAttempts
}: Readonly<Props>) {
  const average = useMemo(() => {
    return calculatePercentage(attempts, hits)
  }, [hits, attempts])

  const totalAverage = useMemo(() => {
    return calculatePercentage(totalAttempts, totalHits)
  }, [totalHits, totalAttempts])

  const diff = useMemo(() => {
    return average - totalAverage
  }, [average, totalAverage])

  return (
    <div className="flex shrink-0 flex-col justify-center gap-2 pl-4">
      <div>
        <p className="-mb-1 text-xs font-bold text-neutral-400 uppercase">
          Total
        </p>
        <p className="font-mono text-2xl font-bold">
          <NumberFlow value={totalAverage} />%
        </p>
      </div>
      <div>
        <p className="-mb-2 text-xs font-bold text-neutral-400 uppercase">
          Difference
        </p>
        <p className="font-mono text-4xl font-bold">
          <NumberFlow value={diff} />%
        </p>
      </div>
    </div>
  )
}
