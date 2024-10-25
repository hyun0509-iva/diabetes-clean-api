import { Schema, model } from "mongoose";
import { ILikes } from "../services/likes/interface/likes";

const { ObjectId } = Schema.Types;

const LikeSchema = new Schema<ILikes>({
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
}, {
  timestamps: true,
  versionKey: false
});

const Like = model<ILikes>("Like", LikeSchema);
export default Like;
