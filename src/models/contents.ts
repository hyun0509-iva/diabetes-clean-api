import mongoose, { Schema, model } from "mongoose";
import { IContents } from "../services/contents/interface/contents";
const { ObjectId } = Schema.Types;

const contentsSchema = new Schema<IContents>(
  {
    writer: {
      type: ObjectId,
      ref: "User"
    },
    content: {
      type: String
    },
    imageData: {
      type: [],
      default: []
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

export type TUserModel = typeof ContentsModel;

// 검색을 위한 인덱싱
contentsSchema.index({ content: "text" });
const ContentsModel = mongoose.models.ContentsModel || model<IContents>("Contents", contentsSchema);
export default ContentsModel;
