import { Request, Response } from "express";
import {
  QueueInterface,
  QueueQueryInterface,
} from "../interfaces/queueInterface";
import {
  createQueueService,
  fetchAllQueuesService,
  fetchOrgQueuesService,
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
  console.log("req.user", req.user);
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

export {
  createQueueController,
  fetchOrgQueuesController,
  fetchAllQueuesController,
  fetchsingleQueueController,
  updateOrgQueuesController,
};
