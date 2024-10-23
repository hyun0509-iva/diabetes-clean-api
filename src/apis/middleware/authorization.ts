import { Request, Response, NextFunction } from "express";
import passport from "passport";
export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: Express.User) => {
    if (err || !user) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }
    console.log('jwt_auth:', user)
    req.user = user;
    next();
  })(req, res, next);
};
