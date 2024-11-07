import { Request, Response, Router } from "express";
import { Types } from "mongoose";
import { authorization } from "../middleware/authorization";
import { isContentsIdValid } from "../middleware/isContentsIdValid";
import { ContentsService } from "../../services/contents";
import { IUserEntity } from "../../services/users/interface/users";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";
import ContentsModel from "../../models/contents";
import UsersModel from "../../models/users";
import CommentModel from "../../models/comment";
import {
  CreateContentsDTO,
  UpdateContentsDTO
} from "../../services/contents/dto";
import { CreateCommentsDto } from "../../services/comments/dto/createCommentsDTO";
import { CommentsService } from "../../services/comments";

export default (app: Router) => {
  const router = Router();

  app.use("/contents", router);

  /* 컨텐츠 기록 */
  router.post(
    "/",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user: IUserEntity = req.user as IUserEntity;
      const contentsDto: CreateContentsDTO = req.body;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const result = await contentsService.createContents(user, contentsDto);
      console.log({ save: result });
      res.json({ isOk: true, msg: "게시글이 등록되었습니다." });
    })
  );

  /* 모든 컨텐츠 조회 */
  router.get(
    "/",
    asyncWapperWithError(async (req: Request, res: Response) => {
      console.log("getAllContents");
      const query = req.query;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const contents = await contentsService.findAll(query);

      if (contents === null) {
        return res.status(204).json({});
      } else if (contents === "no more content to load") {
        return res.status(200).json({
          isOk: true,
          contents: [],
          msg: "더 이상 불러올 컨텐츠가 없습니다."
        });
      }
      res.json({ isOk: true, contents });
    })
  );

  /* 내 피드  */
  router.get(
    "/users/:nickname",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const query = req.query;
      const user: IUserEntity = req.user as IUserEntity;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const contents = await contentsService.findMyfeed(query, user);

      console.log({ contents });
      if (contents === null) {
        return res.status(204).json({});
      } else if (contents === "no more content to load") {
        return res.status(200).json({
          isOk: true,
          contents: [],
          msg: "더 이상 불러올 컨텐츠가 없습니다."
        });
      }
      res.json({ isOk: true, contents });
    })
  );

  /* 유저의 게시글(= 내 피드)의 게시글 정보(내 게시글 포함 x) */
  router.get(
    "/myfeed-info/users/:nickname",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const query = req.query;
      const { nickname } = req.params;
      const user: IUserEntity = req.user as IUserEntity;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const myFeedInfo = await contentsService.getMyFeedInfo(query, user);

      console.log({ myFeedInfo });
      res.json({ isOk: true, myFeedInfo });
    })
  );

  /* 컨텐츠 상세 조회*/
  router.get(
    "/:id",
    asyncWapperWithError(async (req: Request, res: Response) => {
      const { id } = req.params;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const result = await contentsService.findContentsById(id);

      if (result === null) {
        res.status(204).json({});
      }
      res.json({ isOk: true, contents: result });
    })
  );

  /* 컨텐츠 수정 */
  router.patch(
    "/:id",
    isContentsIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;
      const updateContentsDTO: UpdateContentsDTO = req.body;
      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const result = await contentsService.updateContents(
        id,
        updateContentsDTO
      );
      if (result) {
        res.json({ isOk: true, msg: "해당 게시물이 수정되었습니다." });
      }
    })
  );

  /* 컨텐츠 삭제 */
  router.delete(
    "/:id",
    isContentsIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;

      const contentsService = new ContentsService(ContentsModel, UsersModel);
      const result = await contentsService.deleteContents(id);

      if (result) {
        res.json({ isOk: true, msg: "해당 게시물이 삭제되었습니다." });
      }
    })
  );

  /* 컨텐츠 댓글 작성 */
  router.post(
    "/:id/comments",
    isContentsIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id: Types.ObjectId = req.id;
      const user: IUserEntity = req.user as IUserEntity;
      const commentsDto: CreateCommentsDto = req.body;

      const commentsService = new CommentsService(CommentModel);
      const result = await commentsService.createComments(id, user, commentsDto);
      console.log({ save: result });
      res.json({ isOk: true, msg: "댓글이 등록되었습니다." });
    })
  );

  /* 컨텐츠 해당 게시글에 작성된 댓글들 조회 */
  router.get(
    "/:id/comments",
    asyncWapperWithError(async (req: Request, res: Response) => {
      console.log("findComments");
      const { id } = req.params;
      const query = req.query;

      const contentsService = new CommentsService(CommentModel);
      const comments = await contentsService.findComments(query);

      if (comments === null) {
        return res.status(204).json({});
      } else if (comments === "no more content to load") {
        return res.status(200).json({
          isOk: true,
          contents: [],
          msg: "더 이상 불러올 컨텐츠가 없습니다."
        });
      }
      res.json({ isOk: true, comments });
    })

  );

  /* 컨텐츠 댓글 수정 */
  router.patch(
    "/:id/comments",
    asyncWapperWithError(async (req: Request, res: Response) => {})
  );

  /* 컨텐츠 댓글 삭제 */
  router.delete(
    "/:id/comments",
    asyncWapperWithError(async (req: Request, res: Response) => {})
  );

  /* 컨텐츠 좋아요 추가 */
  router.delete("/:id/like");

  /* 컨텐츠 좋아요 삭제 */
  router.delete("/:id/like");
};

/* 
   200 조회 성공
   201 CRUD 작업 성공(이 프로젝트에선 200으로 통일)
   204 컨텐츠가 아직 담기지 않음
   400 (수정, 삭제 처리시)찾는 컨텐츠가 존재하지 않음 
   404 요청한 라우터(api)가 존재하지 않음
*/
