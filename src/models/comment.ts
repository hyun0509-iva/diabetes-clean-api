import { Schema, model } from "mongoose";
import { IComment } from "../services/comment/interface/comment";
const { ObjectId } = Schema.Types;

const commentSchema = new Schema<IComment>(
  {
    writer: {
      type: ObjectId,
      ref: "User"
    },
    contentsId: {
      type: ObjectId,
      ref: "Contents"
    },
    parentCommentId: {
      type: ObjectId,
      ref: "Comments"
    },
    content: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false /* true이면 삭제된 상태 */
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const CommentModel = model<IComment>("Comment", commentSchema);
export default CommentModel;
