import { Session } from '@/data/entities/session.ts'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource.ts'
import type FilterValue from '@/interfaces/data/filter/FilterValue.ts'
import dayjs from 'dayjs'
import { Between, FindOperator } from 'typeorm'

export default async function getFilteredSessions(filter: FilterValue) {
  const connection = PuttLabDataSource

  let sessions: Session[]

  let betweenDate: FindOperator<string>

  if (filter.timeframe === 'day') {
    const date = dayjs(filter.date)
    const start = date.startOf('day')
    const end = date.endOf('day')
    betweenDate = Between(start.toISOString(), end.toISOString())
  } else if (filter.timeframe === 'month') {
    const date = dayjs(filter.date)
    const start = date.startOf('month')
    const end = date.endOf('month')
    betweenDate = Between(start.toISOString(), end.toISOString())
  } else if (filter.timeframe === 'year') {
    const date = dayjs(filter.date)
    const start = date.startOf('year')
    const end = date.endOf('year')
    betweenDate = Between(start.toISOString(), end.toISOString())
  } else {
    // 'all' timeframe
    betweenDate = Between(new Date(0).toISOString(), new Date().toISOString())
  }

  let betweenDistance: FindOperator<number> | number

  if (filter.distanceMode === 'dg') {
    if (filter.distance === 'bullseye') {
      betweenDistance = Between(0, 4)
    } else if (filter.distance === 'c1x') {
      betweenDistance = Between(3, 10)
    } else if (filter.distance === 'c2') {
      betweenDistance = Between(9, 20)
    } else if (filter.distance === 'outside') {
      betweenDistance = Between(20, 1000) // assuming 1000 is a reasonable upper limit
    } else {
      betweenDistance = Between(0, 1000) // default to all distances
    }
  } else {
    betweenDistance = Number(filter.distance)
  }

  sessions = await connection.manager.find(Session, {
    where: {
      date: betweenDate,
      distance: betweenDistance
    },
    order: { date: 'DESC' }
  })

  return sessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
