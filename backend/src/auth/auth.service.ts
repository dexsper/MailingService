import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import * as geoip from 'geoip-lite';

import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

import { verifyPassword } from '../common/crypt';
import { AuthLogEntity } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthLogEntity)
    private readonly authLogRepository: Repository<AuthLogEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    password: string,
    ip: string,
    user_agent: string,
  ) {
    let user: UserEntity;

    try {
      user = await this.usersService.getByLogin(login);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new UnauthorizedException('Incorrect login or password.');
      }
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect login or password.');
    }

    const authLog = this.authLogRepository.create({
      ip_address: ip,
      user_agent: user_agent,
      country: geoip.lookup(ip)?.country || '',
      userId: user.id,
    });

    await this.authLogRepository.insert(authLog);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.login,
        roles: user.roles,
        tokenVersion: user.tokenVersion,
      }),
    };
  }

  async getAuthHistory(userId: number) {
    return await this.authLogRepository
      .createQueryBuilder("log")
      .addSelect("log.createdDate")
      .where("log.userId = :userId", { userId })
      .getMany();
  }
}
