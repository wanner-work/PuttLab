import { Putt } from '@/data/entities/putt'
import DataSource from '@/data/sources/PuttLabDataSource'

export default function getAllPutts() {
  const connection = DataSource
  return connection.manager.find(Putt)
}
