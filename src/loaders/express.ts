import express, { Router, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet, { HelmetOptions } from "helmet";
import env from "../config";
import apis from "../apis";
import { PATH } from "../constants/path";
import NotFoundException from "../exceptions/NotFoundException";
import { passportConfig } from "../auth/passport";

export default (app: express.Application) => {
  const corsOptions = {
    // origin: env.CLIENT_PROD_URL || env.CLIENT_DEV_URL,
    origin: env.CLIENT_DEV_URL,
    credentials: true
  };

  const helmetOptions: Readonly<HelmetOptions> = {
    crossOriginResourcePolicy: { policy: "cross-origin" }
  };

  app.use(morgan("dev"));
  app.use(cors(corsOptions));
  app.use(helmet(helmetOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(express.static(path.join(path.resolve(), "public")));
  app.use(passportConfig());
  
  app.use(PATH.API_BASE_URL, apis());
  app.use((req: Request, res: Response, next: NextFunction) =>
    next(new NotFoundException())
  );
};
