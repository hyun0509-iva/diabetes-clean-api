import { Types } from "mongoose";
import { TContentsLikeModel } from "../../models/contentsLikes";
import { IUserEntity } from "../users/interface/users";

export class ContentsLikeService {
  constructor(private contentsLikeModel: TContentsLikeModel) {}

  async addLike(id: Types.ObjectId, user: IUserEntity) {
    const result = await this.contentsLikeModel.create({
      writer: user._id,
      contents: id
    });
    return result;
  }

  async findLike(id: Types.ObjectId, user: IUserEntity) {
    const contentsLike = await this.contentsLikeModel
      .find()
      .where({
        contents: id
      }).select({
        contents: true,
        writer: true
      })
      const count = await this.contentsLikeModel.countDocuments({contents: id})  
    return {contentsLike, count};  
  }

  async unLike(id: Types.ObjectId, user: IUserEntity) {
    const result = await this.contentsLikeModel.findOneAndDelete({
      writer: user._id,
      contents: id
    });
    return result;
  }
}
