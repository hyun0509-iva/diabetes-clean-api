import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { UsersSeivce } from "../../services/users";
import UsersModel from "../../models/users";
import { isUserIdValid } from "../middleware/isUserIdValid";
import { isUserFieldValid } from "../middleware/isUserFieldValid";
import CustomException from "../../exceptions/CustomException";
import { checkCreateUserField } from "../Validator/checkCreateUserField";
import { authorization } from "../middleware/authorization";
import { UpdateUserDTO } from "../../services/users/dto/updateUserDTO";
import { IUserEntity } from "../../services/users/interface/users";
import { asyncWapperWithError } from "../../utils/asyncWapperWithError";

export default (app: Router) => {
  const router = Router();
  app.use("/users", router);

  /* 사용자 정보 등록 */
  router.post(
    "/",
    checkCreateUserField,
    isUserFieldValid,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const userDto = req.body;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.createUser(userDto);
      if (result === "already created User") {
        throw new CustomException(400, "이미 가입된 유저입니다.");
      }
      res.json({ isOk: true, msg: "회원가입이 되었습니다." });
    })
  );

  /* 모든 사용자 정보 조회 */
  router.get("/", async (req: Request, res: Response) => {
    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.findAll();

    if (result === "no users") {
      throw new CustomException(400, "모든 유저가 존재하지 않습니다.");
    }
    return res.json({ isOk: true, data: result });
  });

  /* 사용자 정보 조회 */
  router.get(
    "/:id",
    isUserIdValid,
    asyncWapperWithError(async (req: Request, res: Response) => {
      // ex: /api/v1/users/65b2859dbf2de07d2da194f2
      const id = req.id as Types.ObjectId;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.findUserById(id);

      if (result === "no user") {
        throw new CustomException(400, "유저가 존재하지 않습니다.");
      }

      return res.json({ isOk: true, data: result });
    })
  );

  /* 사용자 정보 수정 */
  router.patch(
    "/:id",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const updateUserDTO = req.body as UpdateUserDTO;
      const user = req.user as IUserEntity;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.updateUser(updateUserDTO, user);

      res.json({ isOk: true, msg: "해당 유저 정보가 수정되었습니다.", result });
    })
  );

  /* 사용자 정보 삭제 */
  router.delete(
    "/:id",
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user = req.user as IUserEntity;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.deleteUser(user);

      if (result) {
        res.json({ isOk: true, msg: "회원 탈퇴되었습니다." });
      }
    })
  );

  /* 팔로우 추가 */
  router.patch(
    "/:id/follow",
    isUserIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user = req.user as IUserEntity;
      const toUser = req.id;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.addFollow(toUser, user);
      console.log({ result });
      if (result === "no follow yourself") {
        throw new CustomException(400, "자신을 팔로우할 수 없습니다.");
      } else if (result === "already follow") {
        throw new CustomException(403, "이미 팔로우한 유저입니다.");
      }
      res.json({ isOk: true, msg: "팔로우했습니다." });
    })
  );

  /* 팔로우 조회 */
  router.get(
    "/:id/follow",
    isUserIdValid,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const id = req.id as Types.ObjectId;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.findUserFollowById(id);
      res.json({ isOk: true, data: result });
    })
  );

  /* 팔로우 삭제(언팔로우) */
  router.patch(
    "/:id/unfollow",
    isUserIdValid,
    authorization,
    asyncWapperWithError(async (req: Request, res: Response) => {
      const user = req.user as IUserEntity;
      const toUser = req.id;

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.unFollow(toUser, user);
      console.log({ result });

      if (result === "no follow yourself") {
        throw new CustomException(400, "자신을 언팔로우할 수 없습니다.");
      } else if (result === "no followed user") {
        throw new CustomException(403, "팔로우한 대상이 아닙니다.");
      }
      res.json({ isOk: true, msg: "언팔로우했습니다." });
    })
  );

  return router;
};
