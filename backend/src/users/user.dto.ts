import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { UserRole } from './user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'email_required' })
  @MaxLength(120, { message: 'length_max 120' })
  @ApiProperty({ example: 'user@example.com' })
  readonly login: string;

  @IsString({ message: 'string_required' })
  @MinLength(6, { message: 'length_min 6' })
  @ApiProperty({ example: 'Ex@mple123!' })
  readonly password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'string_required' })
  @MinLength(6, { message: 'length_min 6' })
  @ApiProperty({
    example: 'Ex@mple123!',
    required: false,
  })
  password?: string;
}

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  login: string;

  @Expose()
  @ApiProperty({
    isArray: true,
    enum: UserRole,
    example: Object.values(UserRole),
  })
  roles: UserRole[];
}

export class UpdateUserRolesDto {
  @IsEnum(UserRole, { each: true })
  @ApiProperty({
    isArray: true,
    enum: UserRole,
    example: Object.values(UserRole),
  })
  roles: UserRole[];
}

export class DeleteUsersByLoginDto {
  @IsEmail({}, { each: true, message: 'email_required' })
  @MaxLength(120, { each: true, message: 'length_max 120' })
  @ApiProperty({ isArray: true, type: String, example: ['user@example.com'] })
  logins: string[];
}
