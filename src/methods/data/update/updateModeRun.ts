import defaultConnection from '@/data/connections/defaultConnection'
import { ModeRun } from '@/data/entities/moderun'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { Capacitor } from '@capacitor/core'

export default async function updateModeRun(modeRun: ModeRun) {
  await PuttLabDataSource.getRepository(ModeRun).save(modeRun)

  const database = PuttLabDataSource.options.database
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
  }

  return modeRun
}
