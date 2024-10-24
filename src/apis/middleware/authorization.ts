import { Request, Response, NextFunction } from "express";
import passport from "passport";
import NotAuthorizedException from "../../exceptions/NotAuthorizedException";
import { IUserEntity } from "../../services/users/interface/users";
import CustomException from "../../exceptions/CustomException";

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUserEntity, info: { message: string }) => {
      if (err) return console.error(err);
      if (!user) return next(new CustomException(400, info.message));
      req.user = user;
      next();
    }
  )(req, res);
};
