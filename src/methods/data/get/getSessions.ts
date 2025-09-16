import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getSessions(distance: number | null = null) {
  const connection = PuttLabDataSource

  if (distance === null) {
    return connection.manager.find(Session)
  }
  return connection.manager.find(Session, { where: { distance } })
}
