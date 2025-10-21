import defaultConnection from '@/data/connections/defaultConnection'
import type { ModeRun } from '@/data/entities/moderun'
import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { Capacitor } from '@capacitor/core'

export default async function createSession(
  distance: number,
  maxAttempts?: number,
  modeRun?: ModeRun
) {
  const session = new Session()
  session.date = new Date().toISOString()
  session.attempts = 0
  session.hits = 0
  session.distance = distance
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  session.maxAttempts = maxAttempts ?? null

  if (modeRun) {
    session.modeRun = modeRun
  }

  await PuttLabDataSource.getRepository(Session).save(session)

  const database = PuttLabDataSource.options.database
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
  }

  return session
}
