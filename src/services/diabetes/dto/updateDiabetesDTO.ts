import { CreateDiabetesDTO } from "./createDiabetesDTO";

export interface UpdateDiabetesDTO
  extends Pick<CreateDiabetesDTO, "note" | "sugar_level"> {}
