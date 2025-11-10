import { Router } from "express";
import {
  loginController,
  registerController,
  verifyUserRegistrationController,
} from "../controllers/authController";
import { validateRequest } from "../validators/validateRequest";
import {
  createUserSchema,
  loginUserSchema,
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
  "/verify-user",
  validateRequest(verifyUserSchema),
  verifyUserRegistrationController
);

export default authRouter;
