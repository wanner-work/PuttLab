import SessionListDistanceFilterOptions from '@/components/sessions/list/SessionListDistanceFilterOptions'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Session } from '@/data/entities/session'
import { X } from 'lucide-react'
import { useState } from 'react'

interface Props {
  sessions: Session[]
  onFilter: (distance: number | null) => void
}

export default function SessionListFilter({ sessions, onFilter }: Props) {
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

  return (
    <div className="mb-8 flex gap-3">
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
  )
}
