import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { MailboxService } from './mailbox.service';
import { MailboxController } from './mailbox.controller';
import { MailboxEntity } from './mailbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailboxEntity]), UsersModule],
  controllers: [MailboxController],
  providers: [MailboxService],
  exports: [MailboxService],
})
export class MailboxModule {}
