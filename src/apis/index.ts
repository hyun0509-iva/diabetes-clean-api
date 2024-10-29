import { Router } from "express";
import { user, auth, diabetes, contents } from "./routes";

export default () => {
  const app = Router();

  user(app);
  auth(app);
  diabetes(app);
  contents(app);

  return app;
};
