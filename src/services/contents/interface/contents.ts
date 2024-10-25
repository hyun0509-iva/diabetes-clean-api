import { Types } from "mongoose";

export interface IContents {
  writer: Types.ObjectId;
  content: string;
  imageData: Array<any>;
  isDeleted: boolean;
}