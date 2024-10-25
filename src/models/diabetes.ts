import { Schema, model } from "mongoose";
import { IDiabetes } from "../services/diabetes/interface/diabetes";

const { ObjectId } = Schema.Types;

const diabetesSchema = new Schema<IDiabetes>(
  {
    writer: {
      type: ObjectId,
      ref: "User",
      require: true
    },
    sugar_level: {
      type: Number,
      require: true
    },
    slot: {
      type: String,
      require: true
    },
    note: {
      type: String,
      default: ""
    },
    createdAt: {
      type: String,
      default: new Date(),
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

export type TDiabetesModel  = typeof DiabetesModel;

const DiabetesModel = model<IDiabetes>("Diabetes", diabetesSchema);
export default DiabetesModel;
