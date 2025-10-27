import { Card, CardContent } from '@/components/ui/card'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition'
import ModeRequirements from '../description/ModeRequirements'

interface Props {
  mode: ModeDefinition
}

export default function ModeDetail({ mode }: Props) {
  return (
    <Card>
      <CardContent>
        <ModeRequirements mode={mode} />
      </CardContent>
    </Card>
  )
}
