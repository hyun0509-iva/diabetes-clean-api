import { RefreshTokenService } from "./../../services/refreshToken/index";
import { Router, Request, Response } from "express";
import { generateTokens } from "../../utils/generateTokens";
import { checkLoginField } from "../../Validator/checkLoginField";
import { isFieldValid } from "../middleware/isFieldValid";
import { localAuth } from "../middleware/localAuth";
import { authorization } from "../middleware/authorization";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import RefreshTokenModel from "../../models/refleshToken";
import { IUserEntity } from "../../services/users/interface/users";
import NotAuthorizedException from "../../exceptions/NotAuthorizedException";
import {
  verifyRefleshToken,
  verifyExpiredToken
} from "../../utils/verifyToken";
import { JwtPayload } from "jsonwebtoken";
import UsersModel from "../../models/users";

export default (app: Router) => {
  const router = Router();

  app.use("/auth", router);

  /* 인증 상태 */
  router.get(
    "/",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      res.json({ isOk: true, userInfo: req.user });
    })
  );

  /* 이메일 인증 */
  router.post(
    "/login",
    checkLoginField,
    isFieldValid,
    localAuth,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;
      const { accessToken, refreshToken } = generateTokens(user._id);
      // refreshToken을 DB에 저장
      const refreshTokenService = new RefreshTokenService(RefreshTokenModel);
      await refreshTokenService.createToken(user, refreshToken);

      return res.json({
        isOk: true,
        accessToken,
        userInfo: req.user,
        msg: "로그인이 되었습니다."
      });
    })
  );

  /* 로그아웃 */
  router.post(
    "/logout",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;
      console.log({ user });

      const refleshTokenService = new RefreshTokenService(RefreshTokenModel);
      const delTokenResult = await refleshTokenService.deleteToken(user);
      if (!delTokenResult) {
        console.error({ delTokenResult });
        return new NotAuthorizedException();
      }

      res.json({ isOk: true, msg: "성공적으로 로그아웃되었습니다." });
    })
  );

  /* 토큰 재발행 */
  router.post(
    "/reflesh",
    asyncWapperWithError(async (req: Request, res: Response) => {
      const prevToken: string = req.headers.authorization.split("Bearer ")[1];
      const decodedResult = await verifyExpiredToken(prevToken);
      console.log({ decodedResult });
      const userId = (decodedResult.decoded as JwtPayload).id;
      const user = await UsersModel.findById(userId);

      const isVerifyRefleshToken = await verifyRefleshToken(user); // 유저 정보로 디비에 저장된 reflesh token 검증

      console.log({ isVerifyRefleshToken });
      if (isVerifyRefleshToken.isDecode) {
        // refleshToken이 만료되지 않은 경우

        const { accessToken } = generateTokens(isVerifyRefleshToken.userId);

        return res.json({
          isOk: true,
          accessToken,
          userInfo: user,
          msg: "accessToken 재발급됨"
        });
      } else {
        // refleshToken이 만료된 경우
        console.log();
        return res.json({
          is: false,
          isExpiredRefleshToken: true,
          msg: "refleshToken이 만료되었습니다. 다시 로그인해주세요."
        });
      }
    })
  );
};
