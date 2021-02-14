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
            name: 'email',
            type: 'text',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'first_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'display_name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'photo_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'provider_id',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'provider_access_token',
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
