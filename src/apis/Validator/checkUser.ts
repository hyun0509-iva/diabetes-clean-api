import { body } from "express-validator";

export const checkUser = [
  body("email")
    .notEmpty()
    .trim() // 필드가 비어있는지 검증
    .withMessage("이메일을 입력해주세요.")
    .isEmail() // 이메일 형식인지 검증
    .normalizeEmail()
    .withMessage("올바르지 않는 이메일 형식입니다."),
  body("nickname")
    .notEmpty()
    .trim()
    .withMessage("닉네임을 입력해주세요.")
    .isLength({ min: 6, max: 13 })
    .withMessage("닉네임은 6 ~ 13자리를 입력해 주세요"),
  body("password")
    .notEmpty()
    .trim()
    .withMessage("패스워드를 입력해주세요.")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,24}$/)
    .withMessage("비밀번호는 6~24자의 영문 대/소문자, 숫자, 특수문자(!@#$%^&만 포함)를 사용해 주세요.")
];
