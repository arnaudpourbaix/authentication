import { UserEntity } from 'libs/nest-auth/src/lib/user/entities/user.entity';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class UserRecord1604585956439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repository = getRepository(UserEntity);
    const user = repository.create({
      username: 'a',
      password: '123',
      displayName: 'Arnaud',
    });
    await repository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
