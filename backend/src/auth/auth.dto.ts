import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

import { Expose } from 'class-transformer';

export class AuthDto {
  @IsEmail({}, { message: 'email_required' })
  @MaxLength(120, { message: 'length_max 120' })
  @ApiProperty({ example: 'user@example.com' })
  readonly login: string;

  @IsString({ message: 'string_required' })
  @MinLength(6, { message: 'length_min 6' })
  @ApiProperty({ example: 'Ex@mple123!' })
  readonly password: string;
}

export class AuthResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Jason Web Token (JWT) for an authenticated user.',
    example: 'eyJhbGci...',
  })
  accessToken: string;
}

export class AuthLogDto {
  @Expose()
  @ApiProperty()
  ip_address: string;

  @Expose()
  @ApiProperty()
  user_agent: string;

  @Expose()
  @ApiProperty()
  country: string;

  @Expose()
  @ApiProperty()
  createdDate: Date;
}
