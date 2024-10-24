import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { TUserModel } from "../../models/users";
import { createUserDTO } from "./dto/createUserDTO";
import { UpdateUserDTO } from "./dto/UpdateUserDTO";
import { IUserEntity } from "./interface/users";

export class UsersSeivce {
  constructor(private userModel: TUserModel) {}

  async createUser(userCreateDto: createUserDTO) {
    const exUser = await this.userModel.exists({ email: userCreateDto.email });
    if (exUser) {
      return "already created User";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userCreateDto.password, salt);
    const result = await this.userModel.create({
      ...userCreateDto,
      password: hashedPassword
    });
    return result;
  }

  async findById(id: Types.ObjectId): Promise<IUserEntity | string> {
    const user = await this.userModel.findById(id);
    if (!user) return "no user";
    const { password, ...data } = user._doc;
    return data;
  }

  async update(data: UpdateUserDTO, user: IUserEntity) {
    const result = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        $set: data
      },
      {
        new: true
      }
    );
    return result;
  }

  async delete(user: IUserEntity) {
    const result = await this.userModel.findByIdAndDelete(user._id, {
      new: true
    });
    return result;
  }
}
