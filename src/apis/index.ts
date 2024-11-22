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

// Request <- res.data
// Request (1) auth: {isOk: true, data: data, msg: null | 'message'}
// Request (2) common : {isOk: true, data: data, msg: null | 'message'}