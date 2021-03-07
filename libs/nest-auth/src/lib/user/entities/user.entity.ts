import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'email', type: 'text', nullable: false, unique: true })
  email!: string;

  @Exclude()
  @Column({ name: 'password', type: 'text', nullable: true })
  password: string | undefined | null;

  @Column({ name: 'first_name', type: 'text', nullable: true })
  firstName: string | undefined | null;

  @Column({ name: 'last_name', type: 'text', nullable: true })
  lastName: string | undefined | null;

  @Column({ name: 'display_name', type: 'text', nullable: true })
  displayName: string | undefined | null;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl: string | undefined | null;

  @Exclude()
  @Column({ name: 'provider', type: 'text', nullable: true })
  provider: string | undefined | null;

  @Exclude()
  @Column({ name: 'provider_id', type: 'text', nullable: true })
  providerId: string | undefined | null;

  @Exclude()
  @Column({ name: 'provider_access_token', type: 'text', nullable: true })
  providerAccessToken: string | undefined | null;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 13);
    }
  }
}
