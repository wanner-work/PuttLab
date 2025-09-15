import defaultConnection from "@/data/connections/defaultConnection"
import { Session } from "@/data/entities/session"
import PuttLabDataSource from "@/data/sources/PuttLabDataSource"
import { Capacitor } from "@capacitor/core"

export default async function createSession(distance: number, maxAttempts?: number) {
    const session = new Session()
    session.date = new Date().toISOString()
    session.attempts = 0
    session.hits = 0
    session.distance = distance
    session.maxAttempts = maxAttempts ?? null

    await PuttLabDataSource.getRepository(Session).save(session)

    const database = PuttLabDataSource.options.database
    if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
      await defaultConnection.saveToStore(database)
    }

    return session
}
