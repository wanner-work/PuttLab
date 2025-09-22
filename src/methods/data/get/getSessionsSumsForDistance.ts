import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import type { FindOptionsWhere } from 'typeorm'

export default function getSessionsSumsForDistance(what: 'attempts' | 'hits', distance: number, additionalWhere: FindOptionsWhere<Session> = {}) {
  return PuttLabDataSource.getRepository(Session).sum(what, {
    distance,
    ...additionalWhere
  })
}
