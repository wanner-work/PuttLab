import connection from '@/database'
import { DataSource } from 'typeorm'
import { Session } from '../entities/session'

const PuttLabDataSource = new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Session],
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  migrationsRun: true
})

export default PuttLabDataSource
