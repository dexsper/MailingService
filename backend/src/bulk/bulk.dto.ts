import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CreateUserDto } from 'src/users/user.dto';
import { MailboxDto } from 'src/mailbox/mailbox.dto';

export class FullUserDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ValidateNested()
  @Type(() => MailboxDto)
  mailbox: MailboxDto;
}
