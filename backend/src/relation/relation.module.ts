import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { MailboxModule } from 'src/mailbox/mailbox.module';

import { CoreRelationResolver } from './resolvers';
import { UserRelationResolver } from './resolvers/user-resolver';

@Module({
  imports: [UsersModule, MailboxModule],
  providers: [CoreRelationResolver, UserRelationResolver],
  exports: [CoreRelationResolver],
})
export class RelationModule {}
