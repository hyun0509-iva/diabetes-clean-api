import { Schema, model } from "mongoose";
import { ILikes } from "../services/likes/interface/likes";

const { ObjectId } = Schema.Types;

const LikeSchema = new Schema<ILikes>(
  {
    writer: {
      type: ObjectId,
      ref: "User"
    },
    contentsType: {
      type: String
    },
    contents: {
      type: ObjectId,
      ref: "Contents"
    },
    comments: {
      type: ObjectId,
      ref: "Comment"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type TLikeModel = typeof LikeModel;

const LikeModel = model<ILikes>("Like", LikeSchema);
export default LikeModel;
