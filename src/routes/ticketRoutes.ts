import { Router } from "express";
import {
  fetchQueueUsersController,
  joinQueueController,
} from "../controllers/queueController";
import {
  verifyOrgAccess,
  verifyUserAccess,
} from "../middlewares/tokenValidation";

const ticketRouter = Router();

ticketRouter.post("/users/queue/join", verifyUserAccess, joinQueueController);
ticketRouter.post(
  "/org/queue/tickets",
  verifyOrgAccess,
  fetchQueueUsersController
);

export default ticketRouter;
