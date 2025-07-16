import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RelationModule } from 'src/relation/relation.module';

import { RbacService } from './rbac.service';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [RelationModule],
  providers: [
    RbacService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RbacModule {}
