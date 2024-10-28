import { Router } from "express";
import user from "./routes/user";
import auth from "./routes/auth";
import contents from "./routes/contents";

export default () => {
  const app = Router();

  user(app);
  auth(app);
  contents(app);

  return app;
};
