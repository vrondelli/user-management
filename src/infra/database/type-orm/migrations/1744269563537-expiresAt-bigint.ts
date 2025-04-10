import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpiresAtBigint1744269563537 implements MigrationInterface {
    name = 'ExpiresAtBigint1744269563537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "expiresAt" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "expiresAt" integer NOT NULL`);
    }

}
