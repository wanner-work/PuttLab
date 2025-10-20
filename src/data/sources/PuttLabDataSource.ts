import { ModeRun } from '@/data/entities/moderun.ts'
import { DataSource } from 'typeorm'
import connection from '../connections/defaultConnection'
import { Session } from '../entities/session'

export default new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Session, ModeRun],
  logging: true,
  synchronize: true,
  migrationsRun: false,
  migrations: []
})
