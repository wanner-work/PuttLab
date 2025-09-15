import defaultConnection from "@/data/connections/defaultConnection";
import { Session } from "@/data/entities/session";
import PuttLabDataSource from "@/data/sources/PuttLabDataSource";
import { Capacitor } from "@capacitor/core";

export default async function updateSession (session: Session) {
  await PuttLabDataSource.getRepository(Session).save(session)

    const database = PuttLabDataSource.options.database
    if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
      await defaultConnection.saveToStore(database)
    }
 
    return session
}