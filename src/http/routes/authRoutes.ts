import * as authController from "../controllers/authController";
import { validateRegister, validateLogin } from "../validators/authValidator";
import { checkJwt } from "../middleware/jwt";

export default [
  {
    path: "/api/v1/auth/register",
    method: "post",
    handler: [validateRegister, authController.register]
  },
  {
    path: "/api/v1/auth/login",
    method: "post",
    handler: [validateLogin, authController.login]
  },
  {
    path: "/api/v1/auth/change-password",
    method: "post",
    handler: [checkJwt, authController.changePassword]
  }
];
