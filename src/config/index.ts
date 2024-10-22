import "dotenv/config";
import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
  MONGO_PATH: str(),
  PORT: port({ default: 5000 }),
  CLIENT_DEV_URL: str(),
  // CLIENT_PROD_URL: str(),
  JWT_SECRET: str(),
  JWT_ALGORITHN: str(),
  JWT_SHORT_EXPIRESIN: str(),
  COOKIE_SECRET: str(),
  NODE_ENV: str({
    choices: ["development", "production", "test"]
  })
});

export default env;
