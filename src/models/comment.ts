import { Schema, model } from "mongoose";
import { IComment } from "../services/comments/interface/comment";
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

export type TCommentsModel = typeof CommentModel;

const CommentModel = model<IComment>("Comment", commentSchema);
export default CommentModel;
