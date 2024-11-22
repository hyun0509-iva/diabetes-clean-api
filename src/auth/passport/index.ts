import { NextFunction, Request, Response } from "express";
import localStrategy from "./strategy/localStrategy";
import jwtStrategy from "./strategy/jwtStrategy";
import passport from "passport";

export const passportConfig =
  () => (req: Request, res: Response, next: NextFunction) => {
    // 전략들 실행
    localStrategy();
    jwtStrategy();
    
    // passport 초기화 : passport 초기 구성 및 제공된 타입 적용(req.user등)
    passport.initialize();
    next();
  };
