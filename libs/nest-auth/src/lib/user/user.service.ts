import { CreateUserDto } from '@authentication/common-auth';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getUserByProviderId(providerId: string) {
    return await this.userRepository.findOne({ providerId });
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(user: CreateUserDto) {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('Cette adresse email est déjà utilisée.');
    }
    const entity = this.userRepository.create({
      email: user.email,
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

  async createFromProvider(user: Partial<UserEntity>) {
    const entity = this.userRepository.create(user);
    return this.userRepository.save(entity).catch((error) => {
      console.error(error);
      throw new HttpException(
        "Erreur technique lors de la création de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
