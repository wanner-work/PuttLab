import { DataSource } from 'typeorm'
import connection from '../connections/defaultConnection'
import { Session } from '../entities/session'

export default new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Session],
  logging: 'all',
  synchronize: true,
  migrationsRun: false,
  migrations: []
})
