import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { MailboxModule } from 'src/mailbox/mailbox.module';

import { BulkController } from './bulk.controller';
import { BulkService } from './bulk.service';

@Module({
  imports: [UsersModule, MailboxModule],
  controllers: [BulkController],
  providers: [BulkService],
})
export class BulkModule {}
