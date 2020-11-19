import { RegisterData, User } from '@authentication/common-auth';
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

  //async create(user: User) {
  async create(user: RegisterData) {
    const existingUser = this.findOne(user.username);
    if (existingUser) {
      //   throw new Error('username already exists');
      return Promise.reject('username already exists');
    }
    const entity = this.userRepository.create({
      username: user.username,
      password: user.password,
      //   googleId: user.id,
      //   displayName: user.displayName,
      //   photoUrl: user.photoUrl,
    });
    return this.userRepository.save(entity);
  }
}
