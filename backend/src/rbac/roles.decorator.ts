import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { UserRole } from '../users/user.entity';
import { UserRelationRole } from '../relation/roles';

export function Roles(
  globalRoles?: (keyof typeof UserRole)[],
  relationRoles?: (keyof typeof UserRelationRole)[],
) {
  if (!globalRoles?.length && !relationRoles?.length) {
    return () => {};
  }

  const globalRolesValues = globalRoles
    ? globalRoles.map((role) => UserRole[role])
    : [];

  const relationRolesValues = relationRoles
    ? relationRoles.map((role) => UserRelationRole[role])
    : [];

  return applyDecorators(
    SetMetadata('roles', globalRolesValues),
    SetMetadata('relationRoles', relationRolesValues),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}
