import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card.tsx'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import { Link } from '@tanstack/react-router'
import type { RowComponentProps } from 'react-window'

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
      to="/improved/modes/$modeId"
      viewTransition={{ types: ['slide-left'] }}
      params={{ modeId: String(mode.id) }}
      className="select-none"
      style={style}
    >
      <Card>
        <CardContent>
          <mode.icon className="mb-4 size-8" />
          <p className="text-xl">{mode.name}</p>
          <p className="text-sm text-neutral-400">{mode.description}</p>

          <Button className="mt-4 w-full" size="sm" variant="outline">
            Play Mode
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
