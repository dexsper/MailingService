import { UserRelationRole } from './roles';
import { UserEntity } from '../users/user.entity';

export interface IRelationResolver {
  getSupportedRelations(): UserRelationRole[];

  getRelations(user: UserEntity, request: any): Promise<UserRelationRole[]>;
}
