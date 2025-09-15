import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getAllSessions() {
  const connection = PuttLabDataSource
  return connection.manager.find(Session)
}
