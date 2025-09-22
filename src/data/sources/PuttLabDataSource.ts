import connection from '@/data/connections/defaultConnection'
import { DataSource } from 'typeorm'
import { Session } from '../entities/session'

const PuttLabDataSource = new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Session],
  logging: ['error', 'query', 'schema'],
  synchronize: false,
  migrationsRun: true
})

export default PuttLabDataSource
