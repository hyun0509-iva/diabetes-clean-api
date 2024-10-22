export const PATH = {
  BASIC_CLIENT_URL: "http://localhost:3000",
  API_BASE_URL: "/api/v1",
  USERS: "users",
  AUTH: "auth",
  DIABETES: "diabetes",
  CONTENTS: "contents",
  COMMENT: "comment",
  LIKE: "like",
  SEARCH: "search",
  INDEX_PATH: "/",
  FIND_BY_ID: "/:id",
  GET_USER_FIND_BY_ID: "/users/:id",
  GET_USER_CONTENTS: "/users/:nickname",
  GET_CONTENTS_FIND_BY_ID: "/contents/:id",
  GET_COMMENT_FIND_BY_ID: "/comment/:id",
  LOG_IN: "/login",
  LOG_OUT: "/logout",
  CHECK_EMAIL: "/checkemail"
} as const;