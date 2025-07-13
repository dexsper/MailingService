import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Roles } from '../rbac';
import { ApiJwtAuth, CurrentUser } from '../auth/decorators';
import { ApiValidationError } from '../common/decorators/validation.decorator';

import { MailboxService } from './mailbox.service';
import {
  MailboxDto,
  MailboxFiltersDto,
  MessagePreviewDto,
  MessageDto,
} from './mailbox.dto';

@ApiJwtAuth()
@Controller('mailbox')
@ApiValidationError()
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Get('messages/get')
  @CacheTTL(10_000)
  @UseInterceptors(CacheInterceptor)
  @SerializeOptions({ type: MessagePreviewDto })
  @ApiOperation({ summary: 'Get messages preview in mailbox' })
  @ApiOkResponse({
    isArray: true,
    type: MessagePreviewDto,
    description: 'Return mailbox messages',
  })
  async getMessages(@CurrentUser('id') userId: number) {
    return this.mailboxService.getMessages(userId);
  }

  @Get('messages/get/:messageId')
  @CacheTTL(30_000)
  @UseInterceptors(CacheInterceptor)
  @SerializeOptions({ type: MessageDto })
  @ApiOperation({ summary: 'Get message content in mailbox' })
  @ApiOkResponse({
    type: MessageDto,
    description: 'Return mailbox messages',
  })
  @ApiNotFoundResponse({
    description: 'Message not found',
  })
  async getMessage(
    @CurrentUser('id') userId: number,
    @Param('messageId') messageId: number,
  ) {
    return this.mailboxService.getMessage(userId, messageId);
  }

  @Get(':userId/client')
  @Roles(['Admin'])
  @SerializeOptions({ type: MailboxDto })
  @ApiOperation({ summary: 'Get user mailbox' })
  @ApiOkResponse({ type: MailboxDto })
  @ApiNotFoundResponse({
    description: 'Mailbox not found',
  })
  async getMailbox(@Param('userId') userId: number) {
    return this.mailboxService.getMailboxByUserId(userId);
  }

  @Put(':userId/client')
  @Roles(['Admin'])
  @SerializeOptions({ type: MailboxDto })
  @ApiOperation({ summary: 'Create or update user mailbox' })
  @ApiOkResponse({
    type: MailboxDto,
    description: 'Mailbox successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async upsertMailbox(
    @Param('userId') userId: number,
    @Body() mailboxDto: MailboxDto,
  ) {
    return this.mailboxService.upsertMailbox(userId, mailboxDto);
  }

  @Get(':userId/client/check')
  @Roles(['Admin'])
  @SerializeOptions({ type: MailboxDto })
  @ApiOperation({ summary: 'Check user mailbox' })
  @ApiNotFoundResponse({
    description: 'Mailbox not found',
  })
  async checkMailbox(@Param('userId') userId: number) {
    return this.mailboxService.check(userId);
  }
}
