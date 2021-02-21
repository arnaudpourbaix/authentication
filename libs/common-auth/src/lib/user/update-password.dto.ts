import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
