import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController";
import { validateRequest } from "../validators/validateRequest";
import { createUserSchema } from "../validators/userSchema";
const authRouter = Router();

authRouter.post("/register", validateRequest(createUserSchema), registerController);
authRouter.post("/login", loginController);

export default authRouter;
