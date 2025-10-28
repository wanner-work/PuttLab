import defaultConnection from '@/data/connections/defaultConnection'
import { ModeRun } from '@/data/entities/moderun'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'
import { Capacitor } from '@capacitor/core'

export default async function deleteModeRun(modeRun: ModeRun | ModeRun[]) {
  const modeRuns = Array.isArray(modeRun) ? modeRun : [modeRun]

  console.log('Deleting mode runs:', modeRuns)

  await Promise.all(
    modeRuns.map(async (run) => {
      await PuttLabDataSource.getRepository(ModeRun).delete(run)
      console.log(`Deleted mode run: ${run.id}`)
    })
  )

  const database = PuttLabDataSource.options.database
  console.log('Database option:', database)
  if (Capacitor.getPlatform() === 'web' && typeof database === 'string') {
    await defaultConnection.saveToStore(database)
    console.log(`Save to web database: ${database}`)
  }
}
