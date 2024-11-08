import mongoose, { Schema, model } from "mongoose";
import { IContentsLikes } from "../services/contentsLikes/interface/likes";

const { ObjectId } = Schema.Types;

const ContentsLikeSchema = new Schema<IContentsLikes>(
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

export type TContentsLikeModel = typeof ContentsLikeModel;

const ContentsLikeModel =
  mongoose.models.ContentsLikeModel ||
  model<IContentsLikes>("ContentsLike", ContentsLikeSchema);
export default ContentsLikeModel;
