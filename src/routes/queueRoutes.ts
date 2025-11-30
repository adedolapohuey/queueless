import { Router } from "express";
import {
  createQueueController,
  fetchAllQueuesController,
  fetchOrgQueuesController,
  updateOrgQueuesController,
} from "../controllers/queueController";
import { validateRequest } from "../validators/validateRequest";
import {
  createQueueSchema,
  querySchema,
  updateQueueSchema,
} from "../validators/queueSchema";
import {
  verifyOrgAccess,
  verifyUserAccess,
} from "../middlewares/tokenValidation";

const queueRouter = Router();

queueRouter.post(
  "/queue",
  verifyOrgAccess,
  validateRequest(createQueueSchema),
  createQueueController
);

queueRouter.post(
  "/users/queue",
  verifyUserAccess,
  validateRequest(querySchema),
  fetchAllQueuesController
);

queueRouter.post(
  "/org/queue",
  verifyOrgAccess,
  validateRequest(querySchema),
  fetchOrgQueuesController
);

queueRouter.put(
  "/org/queue",
  verifyOrgAccess,
  validateRequest(updateQueueSchema),
  updateOrgQueuesController
);

export default queueRouter;
