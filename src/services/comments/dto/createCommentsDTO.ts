import { ObjectId } from "mongoose";

export interface CreateCommentsDto {
  parentCommentId?: ObjectId;
  content: string;
}