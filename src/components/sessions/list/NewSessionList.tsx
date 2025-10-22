import type { Session } from '@/data/entities/session'
import { motion } from 'motion/react'

interface Props {
  sessions: Session[]
}

export default function NewSessionList({ sessions }: Props) {
  return (
    <motion.div
      key="new-session-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {sessions.length} sessions loaded in NewSessionList
    </motion.div>
  )
}
