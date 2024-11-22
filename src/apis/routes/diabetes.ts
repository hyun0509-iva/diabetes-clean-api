import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { authorization } from "../middleware/authorization";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import { IUserEntity } from "../../services/users/interface/users";
import {
  CreateDiabetesDTO,
  UpdateDiabetesDTO
} from "../../services/diabetes/dto";
import { DiabetesService } from "../../services/diabetes";
import DiabetesModel from "../../models/diabetes";
import { isDiabetesIdValid } from "../middleware/isDiabetesIdValid";
import { checkDiabetesField } from "../../Validator/checkDiabetesField";
import { isFieldValid } from "../middleware/isFieldValid";

export default (app: Router) => {
  const router = Router();

  app.use("/diabetes", router);

  /* 당수치 기록 */
  router.post(
    "/",
    checkDiabetesField,
    isFieldValid,
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
//api/v1/diabetes/users/:id
  /* 유저의모든 당수치 조회 */
  router.get(
    "/users/:id",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;

      const contentsService = new DiabetesService(DiabetesModel);
      const diabetes = await contentsService.findAll(user);

      if (diabetes === null) {
        return res.status(204).json({});
      }
      res.json({ isOk: true, diabetes });
    })
  );

  /* 당수치 상세 조회 */
  router.get(
    "/:id",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const { id } = req.params;

      const contentsService = new DiabetesService(DiabetesModel);
      const diabetes = await contentsService.findDiabetesById(id);

      if (diabetes === null) {
        return res.status(204).json({});
      }
      res.json({ isOk: true, diabetes });
    })
  );

  /* 당수치 수정 */
  router.patch(
    "/:id",
    checkDiabetesField[0],
    isFieldValid,
    isDiabetesIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;
      console.log({ id });
      const updateDiabetesDTO: UpdateDiabetesDTO = req.body;

      const contentsService = new DiabetesService(DiabetesModel);
      const result = await contentsService.updateDiabetes(
        id,
        updateDiabetesDTO
      );
      if (result) {
        res.json({ isOk: true, msg: "해당 당수치 데이터가 수정되었습니다." });
      }
      res.send('ok')
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
