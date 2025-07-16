import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { UserDto } from 'src/users/user.dto';

import { Roles } from 'src/rbac';
import { FullUserDto } from './bulk.dto';
import { BulkService } from './bulk.service';

@Controller('bulk')
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('users')
  @Roles(['Admin'])
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Create new full users' })
  @ApiCreatedResponse({
    isArray: true,
    type: UserDto,
    description: 'User successfully created.',
  })
  @ApiConflictResponse({ description: 'Login already in use.' })
  async createFullUser(@Body() fullUserDto: FullUserDto[]) {
    return this.bulkService.createFullUser(fullUserDto);
  }
}
