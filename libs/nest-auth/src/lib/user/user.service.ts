import { User } from '@authentification/common-auth';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async create(user: User) {
    const entity = this.userRepository.create({
      googleId: user.id,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
    });
    return this.userRepository.save(entity);
  }
}
