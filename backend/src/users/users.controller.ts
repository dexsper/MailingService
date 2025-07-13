import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';

import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Roles } from '../rbac';
import { ApiJwtAuth, CurrentUser } from '../auth/decorators';
import { ApiValidationError } from '../common/decorators/validation.decorator';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';

@ApiJwtAuth()
@Controller('users')
@ApiValidationError()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Roles(['Admin'])
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    type: UserDto,
    description: 'User successfully created.',
  })
  @ApiConflictResponse({ description: 'Login already in use.' })
  signup(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto.login, createDto.password);
  }

  @Patch(':userId')
  @Roles(['Admin'])
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Update the specified user.' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'The specified user was not found' })
  updateUser(
    @Param('userId') userId: number,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateById(userId, updateDto);
  }

  @Delete(':userId')
  @Roles(['Admin'])
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Delete the specified user.' })
  @ApiNotFoundResponse({ description: 'The specified user was not found' })
  deleteUser(@Param('userId') userId: number) {
    return this.usersService.deleteById(userId);
  }

  @Get('all')
  @Roles(['Admin'])
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Get all users.' })
  @ApiOkResponse({ isArray: true, type: UserDto })
  getAll() {
    return this.usersService.getAll();
  }

  @Get('me')
  @SerializeOptions({ type: UserDto })
  @ApiOperation({ summary: 'Get the current authorized user.' })
  @ApiOkResponse({ type: UserDto })
  getMe(@CurrentUser('id') userId: number) {
    return this.usersService.getById(userId);
  }
}
