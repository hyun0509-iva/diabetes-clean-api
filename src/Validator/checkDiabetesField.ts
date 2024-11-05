import { body } from "express-validator";

export const slotList = [
  "공복",
  "아침 식전",
  "아침 식후",
  "점심 식전",
  "점심 식후",
  "저녁 식전",
  "저녁 식후"
];

export const checkDiabetesField = [
  body("sugar_level")
    .notEmpty()
    .trim()
    .withMessage("당뇨 수치를 입력해주세요")
    .isInt()
    .withMessage("당뇨 수치 형식(숫자만 사용)이 올바르지 않습니다."),
  body("slot")
    .notEmpty()
    .trim()
    .withMessage("시간대를 입력해주세요")
    .isIn(slotList)
    .withMessage(`slot은 다음 중 하나여야 합니다: ${slotList.join(", ")}`)
];
