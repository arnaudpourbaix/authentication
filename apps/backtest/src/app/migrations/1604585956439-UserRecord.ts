import { UserEntity } from '@authentication/nest-auth';
import { getRepository, MigrationInterface } from 'typeorm';

export class UserRecord1604585956439 implements MigrationInterface {
  public async up(): Promise<void> {
    const repository = getRepository(UserEntity);
    const user = repository.create({
      username: 'a',
      password: '123',
      displayName: 'Arnaud',
    });
    await repository.save(user);
  }

  public async down(): Promise<void> {
    const repository = getRepository(UserEntity);
    const user = await repository.findOne('a');
    if (user) {
      await repository.remove(user);
    }
  }
}
