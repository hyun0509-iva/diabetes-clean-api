import { Router } from "express";
import user from "./routes/user";
import auth from "./routes/auth";

export default () => {
  const app = Router();

  user(app);
  auth(app);

  return app;
};
