import { Request, Response } from "express";
import authRouter from "./authRoutes";
import { User } from "../models/user.model";
const router = require("express").Router();

const routes = "/api/v1";
router.use(routes, authRouter);

router.get("/", async (req: Request, res: Response) => {
  await User.destroy({ where: {}, truncate: true });
  return res
    .status(200)
    .json({ status: 200, message: "Welcome to the Queueless API" });
});

export default router;
