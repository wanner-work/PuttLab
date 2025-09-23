import type { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTable1758546447182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "date" text NOT NULL, 
                "attempts" integer NOT NULL, 
                "hits" integer NOT NULL, 
                "distance" integer NOT NULL, 
                "maxAttempts" integer
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "session";
        `)
  }
}
