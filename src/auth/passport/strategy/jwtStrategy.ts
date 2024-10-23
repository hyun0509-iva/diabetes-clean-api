import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest
} from "passport-jwt";
import env from "../../../config";
import { UsersSeivce } from "../../../services/users";
import UsersModel from "../../../models/users";

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
  passReqToCallback: false
};

export default () => {
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        console.log({ payload });
        const userService = new UsersSeivce(UsersModel);
        const user = await userService.findById(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error);
      }
    })
  );
};
