import defaultConnection from '@/data/connections/defaultConnection'
import { ModeRun } from '@/data/entities/moderun'
import { Session } from '@/data/entities/session'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { Capacitor } from '@capacitor/core'

export default async function deleteModeRun(modeRun: ModeRun | ModeRun[]) {
  const modeRuns = Array.isArray(modeRun) ? modeRun : [modeRun]

  const modeRunRepo = PuttLabDataSource.getRepository(ModeRun)
  const sessionRepo = PuttLabDataSource.getRepository(Session)

  for (const run of modeRuns) {
    for (const session of run.sessions || []) {
      await sessionRepo.delete({ id: session.id })
    }

    run.sessions = []

    await modeRunRepo.delete({ id: run.id })
  }

  const database = PuttLabDataSource.options.database
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
  }
}
