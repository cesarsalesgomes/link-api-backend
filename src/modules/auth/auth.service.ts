import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthExceptions } from './auth.exceptions';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.getByUsername(username);

    if (!(user && compareSync(password, user.password))) {
      throw new UnauthorizedException({ message: AuthExceptions.INVALID_CREDENTIALS });
    }

    return user;
  }

  async login(user: User) {
    const payload = { ...user };

    return {
      token: this.jwtService.sign(payload)
    };
  }
}
