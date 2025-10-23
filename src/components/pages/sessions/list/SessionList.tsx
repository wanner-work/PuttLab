import type { Session } from '@/data/entities/session'
import { motion } from 'motion/react'
import { List } from 'react-window'
import SessionListItem from './SessionListItem'

interface Props {
  wasLoaded?: boolean
  sessions: Session[]
}

export default function SessionList({ sessions, wasLoaded }: Props) {
  return (
    <motion.div
      initial={{
        opacity: wasLoaded ? 0 : 1,
        clipPath: wasLoaded ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)'
      }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <List
        rowComponent={SessionListItem}
        rowCount={sessions.length || 0}
        rowHeight={(index) => (index === sessions.length - 1 ? 94 : 82)}
        rowProps={{ sessions }}
        overscanCount={5}
      />
    </motion.div>
  )
}
