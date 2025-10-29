import { Card, CardContent } from '@/components/ui/card.tsx'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import { Link } from '@tanstack/react-router'
import type { RowComponentProps } from 'react-window'
import ModeTag from '../detail/ModeTag'

interface Props {
  modes: ModeDefinition[]
}

export default function ModeListItem({
  modes,
  index,
  style
}: RowComponentProps<Props>) {
  const mode = modes[index]

  return (
    <Link
      to="/modes/$modeId"
      viewTransition={{ types: ['slide-left'] }}
      params={{ modeId: String(mode.id) }}
      className="select-none"
      style={style}
    >
      <Card>
        <CardContent>
          <ModeTag mode={mode.category} className="mb-2" />
          <p className="text-xl">{mode.name}</p>
          <p className="text-sm text-neutral-400">{mode.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
