import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateUserDto } from 'src/users/user.dto';
import { MailboxDto } from 'src/mailbox/mailbox.dto';

export class FullUserDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  @ApiProperty({ type: CreateUserDto })
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => MailboxDto)
  @ApiProperty({ type: MailboxDto })
  mailbox: MailboxDto;
}

export class BulkUsersDto {
  @ApiProperty({ type: FullUserDto, isArray: true })
  users: FullUserDto[];
}
