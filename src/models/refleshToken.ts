import { Schema, model } from "mongoose";
import { RefleshTokenType } from "../services/users/interface/users";

const refleshTokenSchema =  new Schema<RefleshTokenType>({
  userId: {
    type: String,
    require: true
  },
  token: {
    type: String,
    require: true,
  }
}, {
  timestamps: true,
  versionKey: false
})
const RefreshToken = model<RefleshTokenType>("RefreshToken", refleshTokenSchema);
export default RefreshToken;


/* refleshToken은 redis에서 나중에 처리할 예정 */