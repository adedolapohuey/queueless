import { Router } from "express";
import {
  initiateForgotPasswordController,
  loginController,
  loginOrganizationController,
  registerController,
  registerOrganizationController,
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
import {
  createOrganizationSchema,
  loginOrganizationSchema,
} from "../validators/organizationSchema";
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

// organization routes
authRouter.post(
  "/org/register",
  validateRequest(createOrganizationSchema),
  registerOrganizationController
);
authRouter.post(
  "/org/login",
  validateRequest(loginOrganizationSchema),
  loginOrganizationController
);

export default authRouter;
