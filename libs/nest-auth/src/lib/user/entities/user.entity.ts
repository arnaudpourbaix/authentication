import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'username', type: 'text', nullable: false, unique: true })
  username!: string;

  @Exclude()
  @Column({ name: 'password', type: 'text', nullable: false })
  password!: string;

  @Column({ name: 'display_name', type: 'text', nullable: false })
  displayName!: string;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl: string | undefined | null;

  @Exclude()
  @Column({ name: 'google_id', type: 'text', nullable: true })
  googleId: string | undefined | null;

  @Column({ name: 'google_token', type: 'text', nullable: true })
  googleToken: string | undefined | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 13);
  }
}
