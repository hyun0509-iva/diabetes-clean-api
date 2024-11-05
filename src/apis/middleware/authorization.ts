import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUserEntity } from "../../services/users/interface/users";
import CustomException from "../../exceptions/CustomException";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUserEntity, info: { message: string }) => {
      console.log({ infoMsg: info?.message });

      if (err) {
        console.error(err);
        throw Error(err.message);
      } else {
        console.log(info?.message);

        if (info?.message === "No auth token") {
          // 토큰이 없으면 인증 에러(401) 처리
          return next(new CustomException(401, "Invalid token"));
        } else if (info?.message === "jwt expired") {
          // 토큰이 만료되면 만료된 토큰 에러(401) 처리
          return next(new CustomException(401, "Expired token"));
        }

        if (!user) return next(new CustomException(400, info?.message));

        req.user = user;
        next();
      }
    }
  )(req, res);
};
