import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { UsersSeivce } from "../../services/users";
import UsersModel from "../../models/users";
import { isUserIdValid } from "../middleware/isUserIdValid";
import { isUserFieldValid } from "../middleware/isUserFieldValid";
import CustomException from "../../exceptions/CustomException";
import { checkCreateUserField } from "../Validator/checkCreateUserField";
import { authorization } from "../middleware/authorization";
import { UpdateUserDTO } from "../../services/users/dto/UpdateUserDTO";
import { IUserEntity } from "../../services/users/interface/users";

export default (app: Router) => {
  const router = Router();
  app.use("/users", router);

  /* 사용자 정보 등록 */
  router.post(
    "/",
    checkCreateUserField,
    isUserFieldValid,
    async (req: Request, res: Response, next: NextFunction) => {
      const userDto = req.body;
      console.log(userDto);

      const userSeivce = new UsersSeivce(UsersModel);
      const result = await userSeivce.createUser(userDto);
      if (result === "already created User") {
        return next(new CustomException(400, "이미 가입된 유저입니다."));
      }
      res.status(201).json({ isOk: true, msg: "회원가입이 되었습니다." });
    }
  );

  /* 모든 사용자 정보 조회 */
  router.get("/", (req: Request, res: Response) => {
    res.send("유저관련 api");
  });

  /* 사용자 정보 조회 */
  router.get("/:id", isUserIdValid, async (req: Request, res: Response) => {
    // ex: /api/v1/users/65b2859dbf2de07d2da194f2
    const id = req.id as Types.ObjectId;

    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.findById(id);
    return res.json({ isOk: true, data: result });
  });

  /* 사용자 정보 수정 */
  router.patch("/:id", isUserIdValid, authorization, async (req, res) => {
    const updateUserDTO = req.body as UpdateUserDTO;
    const user = req.user as IUserEntity;

    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.update(updateUserDTO, user);

    res.json({ isOk: true, msg: "해당 유저 정보가 수정되었습니다.", result });
  });

  /* 사용자 정보 삭제 */
  router.delete("/:id", authorization, async (req, res) => {
    const user = req.user as IUserEntity;

    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.delete(user);

    if(result) {
      res.json({ isOk: true, msg: "회원 탈퇴되었습니다." });
    }
  });

  return router;
};
