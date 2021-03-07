import { UpdatePasswordDto, UpdateUserDto } from '@authentication/common-auth';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

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

  async updatePassword(id: string, user: UpdatePasswordDto) {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    if (
      !!entity.password &&
      !(await bcrypt.compare(user.oldPassword, entity.password))
    ) {
      throw new PreconditionFailedException('Mot de passe actuel incorrecte.');
    }
    entity.password = await bcrypt.hash(user.newPassword, 13);
    return this.userRepository.save(entity).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        "Erreur technique lors de la mise à jour de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  async updateProfile(id: string, user: UpdateUserDto) {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const duplicateUser = await this.findByEmail(user.email);
    if (duplicateUser && duplicateUser.id !== id) {
      throw new ConflictException('Adresse email déjà utilisée.');
    }
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    return this.userRepository.save(entity).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        "Erreur technique lors de la mise à jour de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }

  async createFromProvider(user: Partial<UserEntity>) {
    const entity = this.userRepository.create(user);
    return this.userRepository.save(entity).catch((error) => {
      this.logger.error(error);
      throw new HttpException(
        "Erreur technique lors de la création de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  }
}
