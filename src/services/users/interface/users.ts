import { Types } from "mongoose";

export interface IUser {
  email: string;
  nickname: string;
  password: string;
  imageSrc: string;
  imageData: object;
  aboutMe?: string;
  token: string;
  followers: Array<IUser>;
  followings: Array<IUser>;
}

export interface IUserEntity extends IUser {
  _id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export interface RefleshTokenType extends Pick<IUser, "token"> {
  userId: string;
  createdAt: Date | string;
}

export type ResFollowType = {
  writer: { _id: Types.ObjectId; nickname: string };
} & Pick<IUserEntity, "followers" | "followings">;
