import { Types } from "mongoose"

export interface IUserEntity{
  _id: Types.ObjectId,
  email: string,
  nickname: string,
  imageSrc: string,
  followers: Array<any>,
  followings: Array<any>,
  aboutMe?: string,
  createdAt: string,
  updatedAt: string
}