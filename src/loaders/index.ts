import express from "express";
import expressLoader from './express';
import mongodbLoader from './mongodb';
import errorHandler from "./errorHandler";
 
export default (app: express.Application) => {
  mongodbLoader();
  expressLoader(app);
  errorHandler(app);
};
