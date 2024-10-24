import { Request, Response, NextFunction } from "express";
import passport from "passport";
import NotAuthorizedException from "../../exceptions/NotAuthorizedException";

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: any, info: Object) => {
      // console.log(req);
      if (err || !user) {
        return next(new NotAuthorizedException())
      }
      req.user = user;
      next();
    }
  )(req, res);
};
