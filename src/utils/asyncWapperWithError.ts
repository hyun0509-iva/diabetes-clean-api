import { Request, Response, NextFunction } from "express";

type fnType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncWapperWithError = (cb: fnType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    cb(req, res, next).catch(next);
  };
};