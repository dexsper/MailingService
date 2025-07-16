import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { UsersService } from 'src/users/users.service';
import { MailboxService } from 'src/mailbox/mailbox.service';

import { FullUserDto } from './bulk.dto';

@Injectable()
export class BulkService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailboxService: MailboxService,
  ) {}

  @Transactional()
  async createFullUser(fullUserDto: FullUserDto[], createdById?: number) {
    const result = [];

    for (const user of fullUserDto) {
      const { user: userDto, mailbox } = user;

      const newUser = await this.usersService.create(
        userDto.login,
        userDto.password,
        undefined,
        createdById,
      );

      await this.mailboxService.upsertMailbox(newUser.id, mailbox);
      result.push(newUser);
    }

    return result;
  }
}
