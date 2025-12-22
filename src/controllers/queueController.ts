import { Request, Response } from "express";
import {
  QueueInterface,
  QueueQueryInterface,
  TicketInterface,
} from "../interfaces/queueInterface";
import {
  createQueueService,
  fetchAllQueuesService,
  fetchOrgQueuesService,
  fetchQueueUsersService,
  joinQueueService,
  updateOrgQueuesService,
} from "../services/queueService";
import { queryInterface } from "../interfaces/indexInterface";
import { ExtendedRequest } from "../middlewares/tokenValidation";
import { da } from "zod/v4/locales";

const createQueueController = async (req: Request, res: Response) => {
  const data = req.body as QueueInterface;
  const { status, result } = await createQueueService(data);
  return res.status(status).json(result);
};

const fetchOrgQueuesController = async (
  req: ExtendedRequest,
  res: Response
) => {
  const data = req.body as queryInterface;
  const { status, result } = await fetchOrgQueuesService({
    orgId: req.user!.orgId,
    ...data,
  });
  return res.status(status).json(result);
};

const fetchAllQueuesController = async (req: Request, res: Response) => {
  const data = req.body as queryInterface;
  const { status, result } = await fetchAllQueuesService(data);
  return res.status(status).json(result);
};

const fetchsingleQueueController = async (req: Request, res: Response) => {
  const data = req.body as QueueInterface;
  const { status, result } = await createQueueService(data);
  return res.status(status).json(result);
};

const updateOrgQueuesController = async (req: Request, res: Response) => {
  const data = req.body as QueueQueryInterface;
  const { status, result } = await updateOrgQueuesService(data);
  return res.status(status).json(result);
};

const joinQueueController = async (req: Request, res: Response) => {
  // Implementation for joining a queue will go here
  const data = req.body as Pick<
    TicketInterface,
    "queueId" | "orgId" | "userId"
  >;
  const { status, result } = await joinQueueService(data);
  return res.status(status).json(result);
};

const fetchQueueUsersController = async (req: Request, res: Response) => {
  // Implementation for fetching queue users will go here

  const data = req.body as Pick<TicketInterface, "queueId" | "orgId">;
  const { status, result } = await fetchQueueUsersService(data);
  return res.status(status).json(result);
};

export {
  createQueueController,
  fetchOrgQueuesController,
  fetchAllQueuesController,
  fetchsingleQueueController,
  updateOrgQueuesController,
  joinQueueController,
  fetchQueueUsersController,
};
