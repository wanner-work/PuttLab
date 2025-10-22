import type { Session } from '@/data/entities/session'
import { List } from 'react-window'
import SessionListItem from './SessionListItem'

interface Props {
  sessions: Session[]
}

export default function SessionList({ sessions }: Props) {
  return (
    <List
      rowComponent={SessionListItem}
      rowCount={sessions.length || 0}
      rowHeight={(index) => (index === sessions.length - 1 ? 94 : 82)}
      rowProps={{ sessions }}
    />
  )
}
