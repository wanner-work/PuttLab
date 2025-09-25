import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getSession(sessionId: string) {
  const connection = PuttLabDataSource
  return connection.manager.findOneBy(Session, { id: Number(sessionId) })
}
