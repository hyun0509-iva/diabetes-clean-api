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
    new LocalStrategy(passportConfig, async (req, email, password, done) => {
      try {
        // req 객체를 통해 아래와 같이 사용 가능
        // console.log('Client IP 주소:', req.ip);
        // console.log('HTTP 헤더 정보:', req.headers);
        // console.log('요청 바디의 추가 필드:', req.body.rememberMe);

        const user = await UsersModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "유저가 존재하지 않습니다." }); //인증 실패할 경우 default: 401 Unauthorized statusCode
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "비밀번호가 일치하지 않습니다."
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
