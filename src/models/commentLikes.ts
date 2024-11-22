import { Schema, model } from "mongoose";
import { IContentsLikes } from "../services/contentsLikes/interface/likes";

const { ObjectId } = Schema.Types;

const CommentsLikeSchema = new Schema<IContentsLikes>(
  {
    writer: {
      type: ObjectId,
      ref: "User"
    },
    contents: {
      type: ObjectId,
      ref: "Contents"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type TCommentsLikeModel = typeof CommentsLikeModel;

const CommentsLikeModel = model<IContentsLikes>("CommentsLike", CommentsLikeSchema);
export default CommentsLikeModel;
