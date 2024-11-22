import { TRefreshTokenModel } from "../../models/refleshToken";
import { IUserEntity } from "../users/interface/users";

export class RefreshTokenService {
  constructor(private refreshTokenModel: TRefreshTokenModel) {}

  /* 토큰 저장 */
  async createToken(user: IUserEntity, token: string) {
    const result = await this.refreshTokenModel.create({
      userId: user._id,
      token
    });

    return result;
  }

  /* 토큰 조회 */
  async findOne(user: IUserEntity) {
    const refreshToken = await this.refreshTokenModel.findOne({
      userId: user._id
    });

    if (!refreshToken) return null;
    return refreshToken;
  }

  async deleteToken(user: IUserEntity) {
    const result = await this.refreshTokenModel.deleteOne({
      userId: user._id
    });

    if (!result) return null;
    return result;
  }
}
