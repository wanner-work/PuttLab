import { Card, CardContent } from '@/components/ui/card.tsx'
import useSessions from '@/hooks/data/sessions/useSessions.ts'
import useGuaranteedPutt from '@/hooks/data/stats/useGuaranteedPutt.ts'
import useUnit from '@/hooks/units/useUnit.ts'
import NumberFlow from '@number-flow/react'

export default function EightyDistance() {
  const { sessions } = useSessions(false)
  const distance = useGuaranteedPutt(sessions)

  const { unit, getDistance } = useUnit()

  return (
    <Card>
      <CardContent>
        <p className="font-mono text-2xl font-bold uppercase">
          <NumberFlow
            value={distance ? getDistance(distance) : 0}
            suffix={` ${unit}`}
          />
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          ... is the distance, of where you have about a 80% chance to make the
          putt.
        </p>
      </CardContent>
    </Card>
  )
}
