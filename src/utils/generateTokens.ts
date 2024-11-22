import jwt from "jsonwebtoken";
import env from "../config";

export const generateTokens = (userId: any) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d"
  });

  const refreshToken = jwt.sign({}, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "14d"
  });

  return { refreshToken, accessToken };
};
