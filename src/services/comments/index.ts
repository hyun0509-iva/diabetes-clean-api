import { Types } from "mongoose";
import { TCommentsModel } from "../../models/comment";
import { getPaging } from "../../utils/getPaging";
import { IUserEntity } from "../users/interface/users";
import { CreateCommentsDto, UpdateCommentDTO } from "./dto/commentsDTO";

export class CommentsService {
  constructor(private commentModel?: TCommentsModel) {}

  async createComments(
    id: Types.ObjectId,
    user: IUserEntity,
    createCommentDTO: CreateCommentsDto
  ) {
    const result = await this.commentModel.create({
      ...createCommentDTO,
      writer: user._id,
      contentsId: id
    });
    return result;
  }

  async findComments(query: any) {
    const [currentPage, listSize, totalContents] = await getPaging(
      query,
      {},
      this.commentModel
    );

    console.log({ currentPage, listSize, totalContents });
    const contents = await this?.commentModel
      .find()
      .sort({ createdAt: -1 }) //데이터 최신순으로 정렬
      .skip(listSize * (currentPage - 1))
      .limit(listSize)
      .populate("writer", "nickname imageData email")
      .populate("contentsId", "_id");

    // 다음 페이지 존재 여부 확인
    if (!totalContents) {
      console.log({ totalContents });
      if (currentPage === 1) {
        // 첫 페이지에서 컨텐츠가 없는 경우
        return null;
      } else {
        // 다음 불러올 페이지가 없는 경우
        return "no more content to load";
      }
    }
    return contents;
  }

  async updateComments(commentId: Types.ObjectId, updateCommentDTO: UpdateCommentDTO) {
    const comment = await this?.commentModel.findByIdAndUpdate(commentId, {
      $set: updateCommentDTO
    });
    return comment;
  }

  async deleteComments(commentId: Types.ObjectId) {
    const comment = await this?.commentModel.findByIdAndUpdate(commentId, {
      $set: { isDeleted: true }
    });
    return comment;
  }
}
