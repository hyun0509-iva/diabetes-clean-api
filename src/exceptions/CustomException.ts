import HttpException from "./HttpException";

class CustomException extends HttpException {
  constructor(status: number, message: string) {
    super(status, message);
  }
}

export default CustomException;
