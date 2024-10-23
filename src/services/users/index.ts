import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { IUserModel } from "../../models/users";
import { createUserDTO } from "./createUserDTO";

export class UsersSeivce {
  constructor(private userModel: IUserModel) {}

  async createUser(userCreateDto: createUserDTO) {
    const exUser = await this.userModel.exists({ email: userCreateDto.email });
    if(exUser) {
      return 'already created User';
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userCreateDto.password, salt);
    const users = await this.userModel.create({
      ...userCreateDto,
      password: hashedPassword
    });
    return users;
  }

  async findById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id);
    return user;
  }
}
