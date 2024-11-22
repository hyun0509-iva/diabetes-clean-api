import jwt from "jsonwebtoken";
import env from "../config";
import { RefreshTokenService } from "../services/refreshToken";
import RefreshTokenModel from "../models/refleshToken";
import { IUserEntity } from "../services/users/interface/users";

export const verifyRefleshToken = async (user: IUserEntity) => {
  console.log("Reflesh 토큰 검증");
  const refreshTokenService = new RefreshTokenService(RefreshTokenModel);
  try {
    const savedToken = await refreshTokenService.findOne(user);

    const decoded = jwt.verify(savedToken?.token, env.JWT_SECRET);
    return { isDecode: true, decoded, userId: user._id };
  } catch (error) {
    console.log({ 에러메시지보기: error });
    // error: jwt expired or invalid token(no token)
    await refreshTokenService.deleteToken(user);
    return { isDecode: false };
  }
};

export const verifyExpiredToken = async (token: string) => {
  // reflesh token으로 access token을 발급하기 위함
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      ignoreExpiration: true
    });
    return { isDecode: true, decoded };
  } catch (error) {
    console.log(error);
    return { isDecode: false };
  }
};
