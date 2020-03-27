import {
  Controller, Body, Post
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/')
  @ApiOperation({ summary: 'Cria um usuário' })
  public async createUser(@Body() user: UserDTO): Promise<void> {
    return this.userService.createUser(user);
  }
}
