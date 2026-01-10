import { ModeRun } from '@/data/entities/moderun'
import PuttLabDataSource from '@/data/sources/PuttLabDataSource'

export default function getModeRuns(mode: string) {
  const connection = PuttLabDataSource
  return connection.manager.find(ModeRun, {
    where: {
      mode
    },
    relations: {
      sessions: true
    },
    order: { date: 'DESC' }
  })
}
