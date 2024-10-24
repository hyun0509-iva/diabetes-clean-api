import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest
} from "passport-jwt";
import env from "../../../config";
import UsersModel from "../../../models/users";
import { UsersSeivce } from "../../../services/users";

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
  passReqToCallback: false
};

export default () => {
  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        // 유효한 토큰이면 payload(decoded token 정보)를 전달받음
        // 이 payload로 유저 조회
        const userSeivce = new UsersSeivce(UsersModel);
        const userData = await userSeivce.findById(payload.id);

        if (userData === 'no user') {
          return done(null, false, { message: "유저가 존재하지 않습니다." });
        }
        
        return done(null, userData);
      } catch (error) {
        return done(error);
      }
    })
  );
};
