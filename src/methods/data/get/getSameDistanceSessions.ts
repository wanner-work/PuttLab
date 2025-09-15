import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getSameDistanceSessions(distance: number) {
  const connection = PuttLabDataSource
  return connection.manager.find( Session, { where: { distance } } )
}
