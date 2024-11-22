import { CreateContentsDTO } from "./createContentsDTO";

export interface UpdateContentsDTO extends Pick<CreateContentsDTO, "content"> {}
