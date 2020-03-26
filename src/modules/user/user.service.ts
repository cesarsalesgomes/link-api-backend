import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly UserModel: Model<User>
  ) { }

  async getByUsername(username: string): Promise<User> {
    return this.UserModel.findOne({ username });
  }

  async createUser(userDTO: UserDTO): Promise<void> {
    const { username } = userDTO;
    const password = hashSync(userDTO.password, genSaltSync());

    await new this.UserModel({
      username,
      password
    }).save();
  }

  public async deleteAll(): Promise<void> {
    await this.UserModel.deleteMany({});
  }
}
