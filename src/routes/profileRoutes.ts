import { Router } from "express";
import {
  orgProfileController,
  profileController,
} from "../controllers/authController";
import { verifyOrgAccess, verifyUserAccess } from "../middlewares/tokenValidation";
const profileRouter = Router();

profileRouter.get("/profile", verifyUserAccess, profileController);
profileRouter.get("/org/profile", verifyOrgAccess, orgProfileController);

export default profileRouter;
