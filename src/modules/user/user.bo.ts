import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { UserExceptions } from './user.exceptions';

@Injectable()
export class UserBO {
  constructor(
    @InjectModel('User')
    private readonly UserModel: Model<User>
  ) { }

  /**
   * Lança exceção caso usuário existente na base de dados.
   *
   * @param username string
   */
  public async checkExistingUser(username: string): Promise<void> {
    const user = await this.UserModel.findOne({ username });

    if (user) {
      throw new InternalServerErrorException({ message: UserExceptions.USER_ALREADY_EXISTS });
    }
  }
}
