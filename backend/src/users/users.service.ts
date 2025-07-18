import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';
import { In, Repository } from 'typeorm';

import { hashPassword } from '../common/crypt';

import { UserEntity, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(
    login: string,
    password: string,
    roles: UserRole[] = [UserRole.User],
    createdById?: number,
  ): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ login }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this login or email already exists',
      );
    }

    const newUser = this.usersRepository.create({
      login,
      password: await hashPassword(password),
      roles,
      createdById,
    });

    await this.usersRepository.insert(newUser);
    return newUser;
  }

  async updateById(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.getById(id);
    const updateData: Partial<UserEntity> = { ...data };

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
      updateData.tokenVersion = user.tokenVersion + 1;
    }

    await this.usersRepository.update(id, updateData);

    return {
      ...user,
      ...updateData,
    };
  }

  async updateRolesById(id: number, roles: UserRole[]) {
    const user = await this.getById(id);
    user.roles = roles;
    await this.usersRepository.save(user);
    return user;
  }

  async deleteById(id: number) {
    const result = await await this.usersRepository.delete({
      id,
    });

    return result.affected > 0;
  }

  @Transactional()
  async deleteByLogins(logins: string[]) {
    await this.usersRepository.delete({ login: In(logins) });
  }

  async getById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getByLogin(login: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ login });
    if (!user) {
      throw new NotFoundException(`User with login ${login} not found`);
    }
    return user;
  }

  async getAll(createdById?: number): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      where: [{ createdById }, { id: createdById }],
    });
  }
}
