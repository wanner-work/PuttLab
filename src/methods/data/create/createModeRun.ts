import defaultConnection from '@/data/connections/defaultConnection'
import { ModeRun } from '@/data/entities/moderun'
import { Session } from '@/data/entities/session.ts'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import type ModeDefinition from '@/interfaces/data/mode/ModeDefinition.ts'
import { Capacitor } from '@capacitor/core'

export default async function createModeRun(mode: ModeDefinition) {
  const session = new Session()
  session.date = new Date().toISOString()
  session.attempts = 0
  session.hits = 0
  session.distance = mode.steps[0].repetitions
  session.maxAttempts = mode.steps[0].repetitions

  const modeRun = new ModeRun()
  modeRun.date = new Date().toISOString()
  modeRun.mode = mode.id
  modeRun.sessions = [session]
  await PuttLabDataSource.getRepository(ModeRun).save(modeRun)

  const database = PuttLabDataSource.options.database
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
  }

  return modeRun
}
