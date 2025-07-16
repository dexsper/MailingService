import { Injectable } from '@nestjs/common';

import { UserRelationRole } from '../relation/roles';
import { CoreRelationResolver } from '../relation/resolvers';

import { UserRole } from '../users/user.entity';

@Injectable()
export class RbacService {
  constructor(private coreRelationResolver: CoreRelationResolver) {}

  async authorize(
    request: any,
    requestedGeneralRoles: UserRole[],
    requestedRelationRoles: UserRelationRole[],
  ) {
    const user = request.user;

    if (!user) {
      return false;
    }

    const generalRoles = requestedGeneralRoles.some((role) =>
      user.roles.includes(role),
    );

    if (generalRoles) return true;

    if (requestedRelationRoles) {
      const relationRoles = await this.coreRelationResolver.getRelationRoles(
        user,
        requestedRelationRoles,
        request,
      );
      return this.isAllowed(requestedRelationRoles, relationRoles);
    }

    return false;
  }

  isAllowed(
    requestedRelationRoles: UserRelationRole[],
    containingRelationRoles: UserRelationRole[],
  ) {
    const matches = containingRelationRoles.filter((sr) => {
      return !!requestedRelationRoles.find((rr) => rr === sr);
    });

    return !!matches.length;
  }
}
