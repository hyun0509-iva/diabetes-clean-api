import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import CustomException from "../../exceptions/CustomException";
export const isCreateUserValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new CustomException(400, errors.array()[0].msg));
  } else {
    next();
  }
};
