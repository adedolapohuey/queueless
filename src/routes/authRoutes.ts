import { Router } from "express";
import {
  initiateForgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  verifyCodeController,
} from "../controllers/authController";
import { validateRequest } from "../validators/validateRequest";
import {
  createUserSchema,
  initiateForgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../validators/userSchema";
const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(createUserSchema),
  registerController
);
authRouter.post("/login", validateRequest(loginUserSchema), loginController);
authRouter.post(
  "/verify-code",
  validateRequest(verifyUserSchema),
  verifyCodeController
);
authRouter.post(
  "/forgot-password",
  validateRequest(initiateForgotPasswordSchema),
  initiateForgotPasswordController
);
authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPasswordController
);

export default authRouter;
