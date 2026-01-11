import { IsEnum, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
