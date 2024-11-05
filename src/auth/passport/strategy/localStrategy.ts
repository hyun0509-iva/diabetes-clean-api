import bcrypt from "bcrypt";
import passport from "passport";
import {
  IStrategyOptionsWithRequest,
  Strategy as LocalStrategy
} from "passport-local";
import UsersModel from "../../../models/users";

const passportConfig: IStrategyOptionsWithRequest = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
  session: false
};

export default () => {
  passport.use(
    "local",
    new LocalStrategy(
      passportConfig,
      async (req, req_email, req_password, done) => {
        try {
          /* 인증 처리 */
          const userData = await UsersModel.findOne({ email: req_email });
          if (!userData) {
            return done(null, false, { message: "Not exist user" });
          }
          const { password, ...user } = userData._doc;

          const isMatch = await bcrypt.compare(req_password, password);
          if (!isMatch) {
            return done(null, false, {
              message: "Not match password"
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
