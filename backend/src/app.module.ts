import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import config from './common/configs/config';

import { MailboxModule } from './mailbox/mailbox.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';

import { AppService } from './app.service';
import { RelationModule } from './relation/relation.module';
import { BulkModule } from './bulk/bulk.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        cache: true,
        logging: false,
        autoLoadEntities: true,
        synchronize: true,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    MailboxModule,
    UsersModule,
    AuthModule,
    RbacModule,
    RelationModule,
    BulkModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
