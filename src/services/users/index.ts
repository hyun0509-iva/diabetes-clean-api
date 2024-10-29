import bcrypt from "bcrypt";
import { Types } from "mongoose";
import UsersModel, { TUserModel } from "../../models/users";
import { CreateUserDTO } from "./dto/createUserDTO";
import { UpdateUserDTO } from "./dto/updateUserDTO";
import { ResFollowType, IUserEntity } from "./interface/users";

export class UsersService{
  constructor(private userModel: TUserModel) {}

  async createUser(userCreateDto: CreateUserDTO) {
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

  async findAll(): Promise<Array<IUserEntity> | string> {
    const users = await this.userModel.find({}, { password: 0 });
    if (!users) return "no users";

    return users;
  }

  async findUserById(id: Types.ObjectId): Promise<IUserEntity | string> {
    const user = await this.userModel.findById(id);
    if (!user) return "no user";
    const { password, ...data } = user._doc;
    return data;
  }

  async updateUser(
    data: UpdateUserDTO,
    user: IUserEntity
  ): Promise<IUserEntity | string> {
    const result = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        $set: data
      },
      {
        new: true
      }
    );
    console.log({ result });
    return result;
  }

  async deleteUser(user: IUserEntity): Promise<IUserEntity | string> {
    const result = await this.userModel.findByIdAndDelete(user._id, {
      new: true
    });
    return result;
  }

  async addFollow(
    toUser: Types.ObjectId,
    user: IUserEntity
  ): Promise<string> {
    if (user._id.equals(toUser)) return "no follow yourself";

    const [currentUser, targetUser] = await Promise.all([
      UsersModel.findById(user._id),
      UsersModel.findById(toUser)
    ]);

    if (!currentUser.followings.includes(targetUser._id)) {
      await Promise.all([
        currentUser.updateOne({
          $push: { followings: targetUser._id }
        }),
        targetUser.updateOne({
          $push: { followers: currentUser._id }
        })
      ]);
      return "ok";
    } else {
      return "already follow";
    }
  }

  async findUserFollowById(id: Types.ObjectId): Promise<ResFollowType> {
    const user = await this.userModel.findById(id);
    const { _id, nickname, followers, followings } = user;
    const result = {
      writer: { _id, nickname },
      followers,
      followings
    };
    return result;
  }

  async unFollow(
    toUser: Types.ObjectId,
    user: IUserEntity
  ): Promise<string> {
    if (user._id.equals(toUser)) return "no follow yourself";

    const [currentUser, targetUser] = await Promise.all([
      UsersModel.findById(user._id),
      UsersModel.findById(toUser)
    ]);

    if (currentUser.followings.includes(targetUser._id)) {
      await Promise.all([
        currentUser.updateOne({
          $pull: { followings: targetUser._id }
        }),
        targetUser.updateOne({
          $pull: { followers: currentUser._id }
        })
      ]);
      return "ok";
    } else {
      return "no followed user";
    }
  }
}
