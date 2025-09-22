import defaultConnection from "@/data/connections/defaultConnection"
import { Session } from "@/data/entities/session"
import PuttLabDataSource from "@/data/sources/PuttLabDataSource"
import { Capacitor } from "@capacitor/core"

export default async function deleteAllSessions() {
    await PuttLabDataSource.getRepository(Session).clear()
    const database = PuttLabDataSource.options.database
    if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
      await defaultConnection.saveToStore(database)
    }
}