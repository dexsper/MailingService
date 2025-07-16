import { Injectable } from '@nestjs/common';

import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

import { IRelationResolver } from '../relation.interface';
import { UserRelationRole } from '../roles';

@Injectable()
export class UserRelationResolver implements IRelationResolver {
  constructor(private readonly usersService: UsersService) {}

  getSupportedRelations(): UserRelationRole[] {
    return [UserRelationRole.UserOwner];
  }

  async getRelations(
    user: UserEntity,
    request: any,
  ): Promise<UserRelationRole[]> {
    const userId = Number(request.params?.userId);
    if (isNaN(userId)) {
      return [];
    }

    const relations = [];
    const ownerId = await this.usersService.getOwnerId(userId);

    if (ownerId === user.id) {
      relations.push(UserRelationRole.UserOwner);
    }

    return relations;
  }
}
