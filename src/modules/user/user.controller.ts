import {
  Controller, Body, Post
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/')
  public async createUser(@Body() user: UserDTO): Promise<void> {
    return this.userService.createUser(user);
  }
}
