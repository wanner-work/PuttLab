import connection from '../connections/defaultConnection'
import { DataSource } from 'typeorm'
import { Session } from '../entities/session'
import { CreateTable1758546447182 } from '../migrations/1758546447182-CreateTable'

export default new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Session],
  logging: 'all',
  synchronize: false,
  migrationsRun: true,
  migrations: [
    CreateTable1758546447182
  ],
})
