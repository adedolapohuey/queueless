import { Request, Response } from "express";
import authRouter from "./authRoutes";
const router = require("express").Router();

// router.use("/api/v1");
const routes = "/api/v1";
router.use(routes, authRouter);

router.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ status: 200, message: "Welcome to the Queueless API" });
});

export default router;
