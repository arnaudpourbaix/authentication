import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserCreate1603223280391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'USER',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'text',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'display_name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'photo_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'google_id',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'google_token',
            type: 'text',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('USER');
  }
}
