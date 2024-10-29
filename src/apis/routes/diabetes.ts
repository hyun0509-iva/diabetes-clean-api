import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { authorization } from "../middleware/authorization";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import { IUserEntity } from "../../services/users/interface/users";
import { CreateDiabetesDTO, UpdateDiabetesDTO } from "../../services/diabetes/dto";
import { DiabetesService } from "../../services/diabetes";
import DiabetesModel from "../../models/diabetes";
import { isDiabetesIdValid } from "../middleware/isDiabetesIdValid";

export default (app: Router) => {
  const router = Router();

  app.use("/diabetes", router);

  /* 당수치 기록 */
  router.post(
    "/",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;
      const contentsDto: CreateDiabetesDTO = req.body;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.createDiabetes(user, contentsDto);
      console.log({ save: result });
      res.json({ isOk: true, msg: "성공적으로 저장되었습니다." });
    })
  );

  /* 모든 당수치 조회 */
  router.get(
    "/",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.findAll(user);

      if (result === null) {
        res.status(204).json({});
      }
      res.json({ isOk: true, data: result });
    })
  );

  /* 당수치 상세 조회 */
  router.get(
    "/:id",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const { id } = req.params;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.findDiabetesById(id);

      if (result === null) {
        res.status(204).json({});
      }
      res.json({ isOk: true, data: result });
    })
  );

  /* 당수치 수정 */
  router.patch(
    "/:id",
    isDiabetesIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;
      const updateDiabetesDTO: UpdateDiabetesDTO = req.body;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.updateDiabetes(id, updateDiabetesDTO);
      if (result) {
        res.json({ isOk: true, msg: "해당 당수치 데이터가 수정되었습니다." });
      }
    })
  );

  /* 당수치 삭제 */
  router.delete(
    "/:id",
    isDiabetesIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id = req.id as Types.ObjectId;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.deleteDiabetes(id);
      if (result) {
        res.json({ isOk: true, msg: "해당 당수치 데이터가 삭제되었습니다." });
      }
    })
  );
};
