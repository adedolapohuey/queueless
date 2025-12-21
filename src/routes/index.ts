import { Request, Response } from "express";
import authRouter from "./authRoutes";
import { verifyAuthToken } from "../middlewares/tokenValidation";
import queueRouter from "./queueRoutes";
import ticketRouter from "./ticketRoutes";
import profileRouter from "./profileRoutes";
// import { User } from "../models/user.model";
const router = require("express").Router();

const routes = "/api/v1";
router.use(routes, authRouter);
router.use(routes, verifyAuthToken, queueRouter);
router.use(routes, verifyAuthToken, ticketRouter);
router.use(routes, verifyAuthToken, profileRouter);

router.get("/", async (req: Request, res: Response) => {
  // await User.destroy({ where: {}, truncate: true });
  return res
    .status(200)
    .json({ status: 200, message: "Welcome to the Queueless API" });
});

export default router;
