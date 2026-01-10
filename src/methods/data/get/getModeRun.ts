import { ModeRun } from '@/data/entities/moderun'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getModeRun(modeRunId: string) {
  const connection = PuttLabDataSource
  return connection.manager.findOne(ModeRun, {
    where: {
      id: Number(modeRunId)
    },
    relations: {
      sessions: true
    }
  })
}
