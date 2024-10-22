import { IUserModel } from "../models/users";

export class UsersSeivce {
  constructor(private userModel: IUserModel) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
}
