import jwt from "jsonwebtoken";
import env from "../config";

export const generateTokens = (user: any) => {
  const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h"
  });

  const refreshToken = jwt.sign({}, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "14d"
  });

  return { refreshToken, accessToken };
};
