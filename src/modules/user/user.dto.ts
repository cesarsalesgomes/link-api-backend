export class UserDTO {
  username: string;

  password: string;

  name: string;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
