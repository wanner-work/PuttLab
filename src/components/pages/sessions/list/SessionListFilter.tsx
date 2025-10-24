import SessionListDistanceFilterOptions from '@/components/sessions/list/SessionListDistanceFilterOptions'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Session } from '@/data/entities/session'
import useSessionsAverage from '@/hooks/data/sessions/useSessionsAverage'
import NumberFlow from '@number-flow/react'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  sessions: Session[]
  filteredSessions: Session[]
  onFilter: (distance: number | null) => void
}

export default function SessionListFilter({
  sessions,
  filteredSessions,
  onFilter
}: Props) {
  const [filter, setFilter] = useState<string | undefined>(undefined)

  const onValueChange = (value: string | undefined) => {
    if (!value) {
      setFilter(undefined)
      onFilter(null)
    } else {
      setFilter(value)
      onFilter(Number(value))
    }
  }

  const average = useSessionsAverage(filteredSessions)

  return (
    <div className="mb-3">
      <div className="mb-3 flex gap-3">
        <Select value={filter ?? ''} onValueChange={onValueChange}>
          <SelectTrigger id="distance" className="w-full">
            <SelectValue placeholder="Filter for distance" />
          </SelectTrigger>

          <SelectContent>
            <SessionListDistanceFilterOptions sessions={sessions} />
          </SelectContent>
        </Select>
        {filter && (
          <Button
            variant="outline"
            className="rounded-3xl"
            onClick={() => onValueChange(undefined)}
          >
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          <NumberFlow
            value={filteredSessions.length ?? 0}
            suffix={filteredSessions.length === 1 ? ' SESSION' : ' SESSIONS'}
          />
        </p>
        <p className="text-muted-foreground">
          <NumberFlow value={average} suffix={'%'} />
        </p>
      </div>
    </div>
  )
}
