import { Schema, model } from "mongoose";
import { RefleshTokenType } from "../services/users/interface/users";

const refleshTokenSchema = new Schema<RefleshTokenType>(
  {
    userId: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type TRefreshTokenModel = typeof RefreshTokenModel;

const RefreshTokenModel = model<RefleshTokenType>(
  "RefreshToken",
  refleshTokenSchema
);

// refleshTokenSchema.index({createdAt:1}, {expireAfterSeconds: 1209600 }); //2*7*24*60*60=1209600 (2주)
refleshTokenSchema.index({createdAt:1}, {expireAfterSeconds: 60 }); //2*7*24*60*60=1209600 (2주)

export default RefreshTokenModel;


/* refleshToken은 redis에서 나중에 처리할 예정 */
