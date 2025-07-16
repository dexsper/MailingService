import {
  Req,
  Body,
  Controller,
  Post,
  SerializeOptions,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common';

import { Request } from 'express';

import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../rbac';
import { ApiJwtAuth, Public } from './decorators';
import { ApiValidationError } from '../common/decorators/validation.decorator';

import { AuthService } from './auth.service';
import { AuthDto, AuthLogDto, AuthResponseDto } from './auth.dto';

@ApiJwtAuth()
@Controller('auth')
@ApiValidationError()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(':userId/history')
  @Roles(['Owner'], ['UserOwner'])
  @SerializeOptions({ type: AuthLogDto })
  @ApiOperation({ summary: 'Get the user authorization history' })
  @ApiOkResponse({
    isArray: true,
    type: AuthLogDto,
    description: 'Authorization history received',
  })
  getHistory(@Param('userId') userId: number) {
    return this.authService.getAuthHistory(userId);
  }

  @Post('signin')
  @Public()
  @SerializeOptions({ type: AuthResponseDto })
  @ApiOperation({ summary: 'Sign in user and return authentication token.' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'User successfully signed.',
  })
  @ApiUnauthorizedResponse({ description: 'Incorrect login or password.' })
  signIn(@Req() req: Request, @Body() authDto: AuthDto) {
    const userAgent = req.headers['user-agent'];
    const forwarded = req.headers['x-forwarded-for'];
    const clientIP = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress;

    return this.authService.signIn(
      authDto.login,
      authDto.password,
      clientIP,
      userAgent,
    );
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Logout the current user.' })
  @ApiNoContentResponse({ description: 'Successfully logged out.' })
  logout(@Req() req) {
    return req.logout();
  }
}
