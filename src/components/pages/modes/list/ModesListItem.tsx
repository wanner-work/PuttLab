import { Card, CardContent } from '@/components/ui/card.tsx'
import useUnit from '@/hooks/units/useUnit.ts'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
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

  const { getDistance, unit } = useUnit()

  const distance = useMemo(() => {
    if (!mode.distanceDescription) return null

    if (mode.distanceDescription.words) {
      return mode.distanceDescription.words
    }

    if (mode.distanceDescription.meters !== undefined) {
      return `${getDistance(mode.distanceDescription.meters)} ${unit}`
    }

    return null
  }, [mode.distanceDescription])

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
          <div className="mb-3 flex items-center justify-between">
            <ModeTag mode={mode.category} />
            {distance && (
              <p className="text-muted-foreground font-mono text-xs uppercase">
                {distance}
              </p>
            )}
          </div>
          <p className="mb-1 text-xl">{mode.name}</p>
          <p className="max-w-52 text-sm text-neutral-400">
            {mode.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
