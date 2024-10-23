import { Router, Request, Response } from "express";
import { generateTokens } from "../../utils/generateTokens";
import { checkLoginField } from "../Validator/checkLoginField";
import { isUserFieldValid } from "../middleware/isUserFieldValid";
import { localAuth } from "../middleware/localAuth";

export default (app: Router) => {
  const router = Router();

  app.use("/auth", router);

  router.post(
    "/login",
    checkLoginField,
    isUserFieldValid,
    localAuth,
    (req: Request, res: Response) => {
      console.log({ user: req.user });
      const { accessToken, refreshToken } = generateTokens(req.user);
      // refreshToken을 DB에 저장
      // req.user.refreshToken = tokens.refreshToken;
      // await req.user.save();

      return res.json({
        isOk: true,
        accessToken,
        userInfo: req.user,
        msg: "로그인이 되었습니다."
      });
    }
  );
};
