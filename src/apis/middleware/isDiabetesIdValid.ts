import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CustomException from "../../exceptions/CustomException";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";

// 올바른 userId인지 검증
// 현재유저(로그인한 유저)로 조회하지 않는 경우
export const isDiabetesIdValid = asyncWapperWithError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const isValid = Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new CustomException(400, "해당 당수치 데이터가 존재하지 않습니다.");
    } else {
      req.id = new Types.ObjectId(id);
      next();
    }
  }
);
