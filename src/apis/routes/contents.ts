import { Request, Response, Router } from "express";
import { Types } from "mongoose";
import { authorization } from "../middleware/authorization";
import { isContentsIdValid } from "../middleware/isContentsIdValid";
import { ContentsService } from "../../services/contents";
import { IUserEntity } from "../../services/users/interface/users";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import ContentsModel from "../../models/contents";
import {
  CreateContentsDTO,
  UpdateContentsDTO
} from "../../services/contents/dto";

export default (app: Router) => {
  const router = Router();

  app.use("/contents", router);

  router.post(
    "/",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;
      const contentsDto: CreateContentsDTO = req.body;

      const contentsService = new ContentsService(ContentsModel);
      const result = await contentsService.createContents(user, contentsDto);
      console.log({ save: result });
      res.json({ isOk: true, msg: "성공적으로 저장되었습니다." });
    })
  );

  router.get(
    "/",
    asyncWapperWithError(async (req: Request, res: Response) => {
      console.log("getAllContents");
      const query = req.query;

      const contentsService = new ContentsService(ContentsModel);
      const result = await contentsService.findAll(query);
      if (result === null) {
        return res.status(204).json({});
      } else if (result === "no more content to load") {
        return res.status(200).json({
          isOk: true,
          contents: [],
          msg: "더 이상 불러올 컨텐츠가 없습니다."
        });
      }
      res.json({ isOk: true, data: result });
    })
  );

  router.get(
    "/:id",
    asyncWapperWithError(async (req: Request, res: Response) => {
      const { id } = req.params;

      const contentsService = new ContentsService(ContentsModel);
      const result = await contentsService.findContentsById(id);

      if (result === null) {
        res.status(204).json({});
      }
      res.json({ isOk: true, data: result });
    })
  );

  router.patch(
    "/:id",
    isContentsIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;
      const updateContentsDTO: UpdateContentsDTO = req.body;
      const contentsService = new ContentsService(ContentsModel);
      const result = await contentsService.updateContents(
        id,
        updateContentsDTO
      );
      if (result) {
        res.json({ isOk: true, msg: "해당 게시물이 수정되었습니다." });
      }
    })
  );

  router.delete(
    "/:id",
    isContentsIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;

      const contentsService = new ContentsService(ContentsModel);
      const result = await contentsService.deleteContents(id);

      if (result) {
        res.json({ isOk: true, msg: "해당 게시물이 삭제되었습니다." });
      }
    })
  );
};

/* 
   200 조회 성공
   201 CRUD 작업 성공(이 프로젝트에선 200으로 통일)
   204 컨텐츠가 아직 담기지 않음
   400 (수정, 삭제 처리시)찾는 컨텐츠가 존재하지 않음 
   404 요청한 라우터(api)가 존재하지 않음
*/
