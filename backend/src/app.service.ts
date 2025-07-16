import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    const login = 'admin@mail.ru';

    try {
      await this.usersService.getByLogin(login);
    } catch (e) {
      if (!(e instanceof NotFoundException)) return;

      const password = this.generateSecurePassword(6);
      await this.usersService.create(login, password, [
        UserRole.User,
        UserRole.Admin,
        UserRole.Owner,
      ]);

      this.logger.log(
        `The default administrator has been created: ${login}:${password}`,
      );
    }
  }

  generateSecurePassword(length: number = 12): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()-_=+[]{};:,.<>?';

    if (length < 4) throw new Error('Password length must be at least 4');

    function getRandom(str: string) {
      return str[Math.floor(Math.random() * str.length)];
    }

    const required = [
      getRandom(letters),
      getRandom(numbers),
      getRandom(specials),
    ];

    const allChars = letters + numbers + specials;

    while (required.length < length) {
      required.push(getRandom(allChars));
    }

    return required.sort(() => Math.random() - 0.5).join('');
  }
}
