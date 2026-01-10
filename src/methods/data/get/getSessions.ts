import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { IsNull } from 'typeorm'

export default async function getSessions(
  distance: number | null = null,
  excludeModeRuns: boolean = true
) {
  const connection = PuttLabDataSource

  let sessions: Session[]

  if (distance === null) {
    sessions = await connection.manager.find(Session, {
      where: {
        modeRun: excludeModeRuns ? IsNull() : undefined
      },
      order: { date: 'DESC' }
    })
  } else {
    sessions = await connection.manager.find(Session, {
      where: { distance, modeRun: excludeModeRuns ? IsNull() : undefined },
      order: { date: 'DESC' }
    })
  }

  return sessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
