import { Router, Response, Request } from "express";
import { UsersSeivce } from "../../services/users";
import UsersModel from "../../models/users";

export default (app: Router) => {
  const router = Router();
  app.use("/users", router);

  router.get("/", (req: Request, res: Response) => {
    res.send("유저관련 api");
  });

  router.get("/:id", async (req: Request, res: Response) => {
    // ex: /api/v1/users/65b2859dbf2de07d2da194f2
    const userSeivce = new UsersSeivce(UsersModel);
    const result = await userSeivce.findById(req.params.id);
    return res.json(result);
  });

  return router;
};
