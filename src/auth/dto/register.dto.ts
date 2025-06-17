// src/auth/dto/register.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/users/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsEnum(UserRole)
  role: UserRole;
}
