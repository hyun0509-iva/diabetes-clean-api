import { Types } from "mongoose";

export interface IContents {
  writer: Types.ObjectId;
  content: string;
  likesCount:  number;
  imageData: Array<any>;
  isDeleted: boolean;
}