import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import CustomException from "../../exceptions/CustomException";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import CommentModel from "../../models/comment";

// 올바른 userId인지 검증
// 현재유저(로그인한 유저)로 조회하지 않는 경우
export const isCommentsIdValid = asyncWapperWithError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const isValid =
      Types.ObjectId.isValid(commentId) &&
      (await CommentModel.findById(commentId));
    if (!isValid) {
      throw new CustomException(400, "해당 댓글이 존재하지 않습니다.");
    } else {
      req.commentId = new Types.ObjectId(commentId);
      next();
    }
  }
);
