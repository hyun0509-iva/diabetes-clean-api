import { Types } from "mongoose";

export interface IContentsLikes {
  writer: Types.ObjectId;
  contents: Types.ObjectId;
}
