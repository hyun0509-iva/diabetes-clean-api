import express from "express";
import loaders from "./loaders";
import env from "./config";

const app: express.Application = express();
loaders(app);
console.log(env.PORT)
app.listen(env.PORT, () => {
  console.log(`Server Listening on http://localhost:${env.PORT}`);
});
