import { Types } from "mongoose";

export interface IComment {
  writer: Types.ObjectId;
  contentsId: Types.ObjectId;
  parentCommentId: Types.ObjectId;
  content: string;
  isDeleted: boolean;
}
