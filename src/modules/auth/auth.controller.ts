import {
  Controller, Request, Post, UseGuards
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Realiza login informando usuário e senha' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
