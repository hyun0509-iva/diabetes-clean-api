import { Types } from "mongoose";
import { TDiabetesModel } from "../../models/diabetes";
import { IUserEntity } from "../users/interface/users";
import { CreateDiabetesDTO } from "./dto/createDiabetesDTO";
import { UpdateDiabetesDTO } from "./dto/updateDiabetesDTO";

export class DiabetesService {
  constructor(private diabetesModel: TDiabetesModel) {}

  async createDiabetes(
    user: IUserEntity,
    createDiabetesDTO: CreateDiabetesDTO
  ) {
    const result = await this.diabetesModel.create({
      ...createDiabetesDTO,
      writer: user._id
    });

    return result;
  }

  async findAll(user: IUserEntity) {
    const writer = user._id;
    const diabetes = await this.diabetesModel
      .find({ writer })
      .sort({ createdAt: -1 }) // 내림차순 정렬
      .populate("writer", "nickname");

    if (!diabetes) return null;
    return diabetes;
  }

  async findDiabetesById(id: string) {
    const diabetes = await this.diabetesModel
      .findById(id)
      .populate("writer", "nickname");

    if (!diabetes) return null;
    return diabetes;
  }

  async updateDiabetes(id: Types.ObjectId, updateDiabetesDTO: UpdateDiabetesDTO) {
    const result = await this.diabetesModel.findByIdAndUpdate(id, {
      $set: updateDiabetesDTO
    });
    return result;
  }

  async deleteDiabetes(id: Types.ObjectId) {
    const result = await this.diabetesModel.deleteOne(id);
    return result;
  }
}
