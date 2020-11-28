import { CreateUserDto } from '@authentication/common-auth';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  //async create(user: User) {
  async create(user: CreateUserDto) {
    const existingUser = await this.findOne(user.username);
    if (existingUser) {
      throw new HttpException(
        "Ce nom d'utilisateur est déjà utilisé. Essayez un autre nom.",
        HttpStatus.CONFLICT
      );
    }
    const entity = this.userRepository.create({
      username: user.username,
      password: user.password,
      //   googleId: user.id,
      //   displayName: user.displayName,
      //   photoUrl: user.photoUrl,
    });
    return this.userRepository.save(entity).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        "Erreur technique lors de la création de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
