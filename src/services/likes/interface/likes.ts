import { Types } from "mongoose";

export interface ILikes {
  writer: Types.ObjectId;
  contentsType: string;
  contents: Types.ObjectId;
  comments: Types.ObjectId;
}
