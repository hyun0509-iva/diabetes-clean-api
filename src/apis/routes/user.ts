import { Router, Request, Response, NextFunction } from "express";
import { UsersSeivce } from "../../services/users";
import UsersModel from "../../models/users";
import { isUserIdValid } from "../middleware/isUserIdValid";
import { isUserFieldValid } from "../middleware/isUserFieldValid";
import CustomException from "../../exceptions/CustomException";
import { checkCreateUserField } from "../Validator/checkCreateUserField";

export default (app: Router) => {
  const router = Router();
  app.use("/users", router);

  router.get("/", (req: Request, res: Response) => {
    res.send("유저관련 api");
  });

  /* 사용자 정보 조회*/
  router.get("/:id", isUserIdValid, async (req: Request, res: Response) => {
    // ex: /api/v1/users/65b2859dbf2de07d2da194f2
    const id = (req as any).id;
    console.log({ id });
    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.findById(id);
    return res.json({ isOk: true, data: result });
  });

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

  /* 사용자 정보 수정 */

  /* 사용자 정보 삭제 */
  return router;
};
