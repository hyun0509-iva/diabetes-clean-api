import mongoose, { Model, Schema, model } from "mongoose";

interface IUser {
  email: string;
  nickname: string;
  password: string;
  imageSrc: string;
  aboutMe: string;
  token: string;
  followers: Array<IUser>;
  followings: Array<IUser>;
}

const { ObjectId } = Schema.Types;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      maxlength: 50,
      require: true
    },
    nickname: {
      type: String,
      maxlength: 50
    },
    password: {
      type: String,
      minglength: 5,
      require: true
    },
    imageSrc: {
      type: String,
      default: ""
    },
    //유저 소개
    aboutMe: {
      type: String,
      max: 80
    },
    followers: [
      {
        type: ObjectId,
        ref: "User"
      }
    ],
    followings: [
      {
        type: ObjectId,
        ref: "User"
      }
    ],
    token: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type TUserModel = typeof UsersModel;

const UsersModel =
  mongoose.models.UsersModel || model<IUser>("User", userSchema);
export default UsersModel;