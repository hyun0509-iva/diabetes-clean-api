import { NextFunction, Request, Response } from "express";
import passport from "passport";
import CustomException from "../../exceptions/CustomException";

export const localAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: Express.User, info: { message: string }) => {
      // new LocalStrategy의 콜백으로 에러처리시 기본값으로 401이므로
      // 별도로 에러처리 해주려면 여기 콜백에서 에러처리하면
      // done 함수가 호출할 때 여기 작성한 부분이 리턴됨
      /* ----------------------------------------------------------- */
      if (err) return console.error(err);
      if (!user) return next(new CustomException(400, info.message));
      req.user = user;
      next();

      // req.login()은 세션을 이용한 로그인 처리
      // req.login(user, (err) => {
      //   if (err) return console.error(err);
      //   <--- 로그인 처리 ---->
      // });
    }
  )(req, res);
};
