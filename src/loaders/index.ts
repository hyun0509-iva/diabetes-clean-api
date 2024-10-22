import express from "express";
import expressLoader from './express';
import mongodbLoader from './mongodb';
import errorHandler from "./errorHandler";
 
export default (app: express.Application) => {
  mongodbLoader();
  errorHandler(app);
  expressLoader(app);
};
