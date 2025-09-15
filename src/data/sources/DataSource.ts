import connection from "@/database";
import { Putt } from "../entities/putt";
import { DataSource } from "typeorm";

export default new DataSource({
  name: 'puttlabConnection',
  type: 'capacitor',
  driver: connection,
  database: 'puttlab',
  entities: [Putt],
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  migrationsRun: true,
});