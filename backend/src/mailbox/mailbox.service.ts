import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

import { UsersService } from '../users/users.service';

import { MailboxEntity } from './mailbox.entity';
import { ImapConfig } from 'src/common/configs';

@Injectable()
export class MailboxService {
  private readonly imapConfig: ImapConfig;

  constructor(
    @InjectRepository(MailboxEntity)
    private readonly mailboxRepository: Repository<MailboxEntity>,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.imapConfig = configService.get<ImapConfig>('imap');
  }

  async upsertMailbox(
    userId: number,
    data: Partial<MailboxEntity>,
  ): Promise<MailboxEntity> {
    const user = await this.usersService.getById(userId);

    await this.mailboxRepository.upsert({ ...data, userId: user.id }, [
      'userId',
    ]);

    return this.mailboxRepository.findOne({
      where: { userId: user.id },
    });
  }

  async getMailboxByUserId(userId: number) {
    const mailbox = await this.mailboxRepository.findOne({ where: { userId } });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    return mailbox;
  }

  async check(userId: number) {
    const mailbox = await this.mailboxRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    const client = this.createImapClient(mailbox);

    try {
      await client.connect();
    } catch (e) {
      throw new UnauthorizedException('Wrong imap client password');
    } finally {
      await client.logout();
    }
  }

  async getMessages(userId: number) {
    const mailbox = await this.mailboxRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    const client = this.createImapClient(mailbox);

    try {
      await client.connect();
    } catch (e) {
      throw new UnauthorizedException('Wrong imap client password');
    }

    const lock = await client.getMailboxLock('INBOX');
    try {
      if (!client.mailbox) {
        return [];
      }
      const total = client.mailbox.exists;

      if (!total) {
        return [];
      }

      const start = total > 20 ? total - 19 : 1;
      const end = total;
      const messages: {
        uid: number;
        subject: string;
      }[] = [];

      const config = {
        envelope: true,
        uid: true,
      };

      for await (const msg of client.fetch(`${start}:${end}`, config)) {
        messages.push({
          uid: msg.uid,
          subject: msg.envelope?.subject ?? '',
        });
      }

      return messages.reverse();
    } finally {
      lock.release();
      await client.logout();
    }
  }

  async getMessage(userId: number, uid: number) {
    const mailbox = await this.mailboxRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!mailbox) {
      throw new NotFoundException('Mailbox not found');
    }

    const client = this.createImapClient(mailbox);

    await client.connect();

    const lock = await client.getMailboxLock('INBOX');
    try {
      const message = await client.fetchOne(uid, {
        envelope: true,
        source: true,
        uid: true,
      });
      if (!message) {
        throw new NotFoundException('Message not found');
      }

      const { envelope } = message;
      let htmlBody: string | undefined = undefined;

      if (message.source) {
        const parsed = await simpleParser(message.source);
        htmlBody = parsed.html || undefined;
      }

      return {
        uid: message.uid,
        subject: envelope?.subject ?? '',
        from: envelope?.from?.[0]?.address ?? '',
        to: envelope?.to?.[0]?.address ?? '',
        date: envelope?.date?.toISOString() ?? '',
        htmlBody,
      };
    } finally {
      lock.release();
      await client.logout();
    }
  }

  private createImapClient(mailbox: MailboxEntity) {
    const proxyCount = this.imapConfig.proxy.length;
    const proxy = this.imapConfig.proxy[Math.floor(Math.random() * proxyCount)];

    return new ImapFlow({
      host: mailbox.host,
      port: mailbox.port,
      secure: mailbox.secure,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: mailbox.user.login,
        pass: mailbox.password,
      },
      logger: false,
      proxy,
    });
  }
}
