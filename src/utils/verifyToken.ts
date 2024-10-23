// import jwt from "jsonwebtoken";
// import env from "../config";

// export const verifyTokens = (token: string) => {
//   const verifyToken = async (token) => {
//     try {
//       const decoded = jwt.verify(token, env.JWT_SECRET);
//       return { isDecode: true, decoded };
//     } catch (error) {
//       console.log(error);
//       return { isDecode: false };
//     }
//   },
//   const verifyRefleshToken = async (token) => {
//     console.log("토큰 검증");
//     const savedToken = await RefreshToken.findOne({ token });
//     if (!savedToken) {
//       return null;
//     } else {
//       try {
//         const decoded = jwt.verify(token, env.JWT_SECRET);
//         return { isDecode: true, decoded, userId: savedToken.userId };
//       } catch (error) {
//         await savedToken.deleteOne()
//         return { isDecode: false };
//       }
//     }
//   }
// }