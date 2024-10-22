import HttpException from "./HttpException";

class NotAuthorizedException extends HttpException {
  constructor() {
    super(401, "인증이 필요합니다.")
  }
}

export default NotAuthorizedException;