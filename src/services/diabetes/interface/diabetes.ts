import { Types } from "mongoose";

export interface IDiabetes {
  writer: Types.ObjectId;
  sugar_level: number;
  slot: string;
  note: string;
  createdAt: String;
}
