import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import NotFoundException from "../../exceptions/NotFoundException";

// 올바른 userId인지 검증
export const isUserIdValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) { 
    next(new NotFoundException());
  } else {
    req.id = new Types.ObjectId(id);
    next();
  }
};
