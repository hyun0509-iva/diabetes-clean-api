import { Types } from "mongoose";
import { TContentsModel } from "../../models/contents";
import { TUserModel } from "../../models/users";
import { IUserEntity } from "../users/interface/users";
import { CreateContentsDTO } from "./dto/createContentsDTO";
import { getPaging } from "../../utils/getPaging";
import { UpdateContentsDTO } from "./dto/updateContentsDTO";
import CommentModel from "../../models/comment";

export class ContentsService {
  constructor(
    private contentsModel: TContentsModel,
    private usersModel: TUserModel
  ) {}

  async createContents(
    user: IUserEntity,
    createContentsDTO: CreateContentsDTO
  ) {
    const result = await this.contentsModel.create({
      ...createContentsDTO,
      writer: user._id
    });

    return result;
  }

  async findAll(query: any) {
    const [currentPage, listSize, totalContents] = await getPaging(
      query,
      {},
      this.contentsModel
    );

    console.log({ currentPage, listSize, totalContents });
    // contents 가져오기
    const contents = await this.contentsModel
      .find()
      .sort({ createdAt: -1 })
      .skip(listSize * (currentPage - 1))
      .limit(listSize)
      .populate("writer", "nickname email imageData");

    // comments 가져오기
    const contentIds = contents.map((content) => content._id);
    const comments = await CommentModel.find({
      contentsId: { $in: contentIds }
    })
      .sort({ createdAt: -1 })
      .populate("writer", "nickname imageData email");

    // 컨텐츠와 댓글을 매칭하여 결과 구성
    const result = contents.map((content) => ({
      ...content.toObject(),
      commentCount: comments.filter((comment) =>
        comment.contentsId.equals(content._id)
      ).length
    }));

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
    return result;
  }

  async findMyfeed(query: any, nickname: string) {
    const user = await this.usersModel.findOne({ nickname });
    const [currentPage, listSize, totalContents] = await getPaging(
      query,
      {
        writer: user?._id
      },
      this.contentsModel
    );

    const contents = await this.contentsModel
      .find()
      .where("writer")
      .equals(user?._id)
      .sort({ createdAt: -1 })
      .skip(listSize * (currentPage - 1))
      .limit(listSize)
      .populate("writer", "email nickname imageData aboutMe");

    // 다음 페이지 존재 여부 확인
    if (!totalContents) {
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

  async getMyFeedInfo(query: any, nickname: string) {
    //const totalContents = await Model.countDocuments(filter);
    const user = await this.usersModel.findOne({ nickname });
    const contentsCount = await this.contentsModel.countDocuments({
      writer: user._id
    });
    const { password, ...writer } = user._doc;

    // 다음 페이지 존재 여부 확인

    const myFeedInfo = {
      contentsCount,
      writer
    };
    return myFeedInfo;
  }

  async findContentsById(id: string) {
    const contents = await this.contentsModel
      .findById(id)
      .populate("writer", "nickname imageData email");

    if (!contents) return "no more content to load";

    // comments 가져오기
    const comments = await CommentModel.find({
      contentsId: contents
    })
      .sort({ createdAt: -1 })
      .populate("writer", "nickname imageData email");

    // 컨텐츠와 댓글을 매칭하여 결과 구성
    const result = {
      ...contents.toObject(),
      comments: comments.filter((comment) =>
        comment.contentsId.equals(contents._id)
      )
    };
    console.log({ result });
    return result;
  }

  async updateContents(
    id: Types.ObjectId,
    updateContentsDto: UpdateContentsDTO
  ) {
    const result = await this.contentsModel.findByIdAndUpdate(id, {
      $set: updateContentsDto
    });
    return result;
  }

  async deleteContents(id: Types.ObjectId) {
    const result = await this.contentsModel.findByIdAndUpdate(id, {
      $set: { isDeleted: true }
    });
    return result;
  }
}

// return
// ㄴ 유저가 존재하지 않는 경우 에러 표시(400)
// ㄴ 컨텐츠(댓글, 게시글등 유저가 작성한 것들)가 존재하지 않는 경우 null 표시(204)
// ㄴ 수정 및 삭제인 경우 id 유효성 검증 (없으면 에러 처리 -> 수정 및 삭제 처리를 못했으므로 400)
