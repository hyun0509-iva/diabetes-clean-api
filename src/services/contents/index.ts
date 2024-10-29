import { TContentsModel } from "src/models/contents";
import { TUserModel } from "../../models/users";
import { IUserEntity } from "../users/interface/users";
import { CreateContentsDTO } from "./dto/createContentsDTO";
import { getPaging } from "../../utils/getPaging";
import { Types } from "mongoose";
import { UpdateContentsDTO } from "./dto/updateContentsDTO";

export class ContentsService {
  constructor(private contentsModel: TContentsModel) {}

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

    const contents = await this.contentsModel
      .find()
      .sort({ createdAt: -1 }) //데이터 최신순으로 정렬
      .skip(listSize * (currentPage - 1))
      .limit(listSize)
      .populate("writer", "nickname imageData");

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

  async findContentsById(id: string) {
    const contents = await this.contentsModel
      .findById(id)
      .populate("writer", "nickname imageData");

    if (!contents) return null;
    return contents;
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
    // const contents = await this.contentsModel.findById(id);
    // if (!contents) return null;

    const result = await this.contentsModel.findByIdAndDelete(id, {
      $set: { isDeleted: true }
    });
    return result;
  }
}

// return
// ㄴ 유저가 존재하지 않는 경우 에러 표시(400)
// ㄴ 컨텐츠(댓글, 게시글등 유저가 작성한 것들)가 존재하지 않는 경우 null 표시(204)
// ㄴ 수정 및 삭제인 경우 id 유효성 검증 (없으면 에러 처리 -> 수정 및 삭제 처리를 못했으므로 400)
