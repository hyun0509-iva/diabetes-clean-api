import HttpException from "./HttpException";

class NotFoundException extends HttpException {
  constructor() {
    super(404, "요청하신 api를 찾을 수 없습니다.");
  }
}

export default NotFoundException;
