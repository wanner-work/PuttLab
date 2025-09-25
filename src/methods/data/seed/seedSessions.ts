import defaultConnection from '@/data/connections/defaultConnection'
import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { Capacitor } from '@capacitor/core'

export default async function seedSessions() {
  for (let i = 0; i < 50; i++) {
    // distance between 2 and 35
    const distance = Math.floor(Math.random() * (35 - 2 + 1)) + 2

    // attempts between 0 and 200
    const attempts = Math.floor(Math.random() * 201)

    // hits between 0 and attempts
    let hits = 0

    if (distance <= 3) {
      // bullseye: 70-100% accuracy
      hits = Math.floor(attempts * (0.8 + Math.random() * 0.3))
    } else if (distance <= 10 && distance > 3) {
      // circle one: 50-80% accuracy
      hits = Math.floor(attempts * (0.6 + Math.random() * 0.3))
    } else if (distance <= 20 && distance > 10) {
      // circle two: 30-60% accuracy
      hits = Math.floor(attempts * (0.2 + Math.random() * 0.3))
    } else {
      // outside circle: 10-40% accuracy
      hits = Math.floor(attempts * (0.1 + Math.random() * 0.3))
    }

    // date within the last 90 days
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    ).toISOString()

    await createSession(distance, attempts, hits, date)
  }
}

async function createSession(
  distance: number,
  attempts: number,
  hits: number,
  date: string
) {
  const session = new Session()
  session.date = date
  session.attempts = attempts
  session.hits = hits
  session.distance = distance

  await PuttLabDataSource.getRepository(Session).save(session)

  const database = PuttLabDataSource.options.database
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
  }

  return session
}
