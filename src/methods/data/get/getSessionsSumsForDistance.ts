import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getSessionsSumsForDistance(what: 'attempts' | 'hits', distance: number) {
  return PuttLabDataSource.getRepository(Session).sum(what, {
    distance
  })
}
