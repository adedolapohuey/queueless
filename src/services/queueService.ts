import { queryInterface, Response } from "../interfaces/indexInterface";
import {
  QueueInterface,
  QueueQueryInterface,
} from "../interfaces/queueInterface";
import { Organization } from "../models/organization.model";
import { AppError } from "../helpers/appError";
import { ResponseHandler } from "../helpers/responseHandler";
import { queueSerializer } from "../serializers/queue.serializer";
import { Queue } from "../models/queue.model";
import { defaults } from "../helpers";
import { Op } from "sequelize";

const createQueueService = async (
  payload: QueueInterface
): Promise<Response> => {
  const { orgId } = payload;

  try {
    const orgExists = await Organization.findOne({
      where: {
        id: orgId,
      },
      attributes: ["name"],
    });

    if (!orgExists) return AppError.notFound("Invalid Organization");

    const newQueue = await Queue.create({
      name: payload.name,
      estimatedInterval: payload.estimatedInterval,
      orgId,
    });

    if (!newQueue.id)
      return AppError.badRequest("Unable to create queue at the moment");

    return ResponseHandler.created("Queue created", queueSerializer(newQueue));
  } catch (error) {
    return AppError.internal();
  }
};

const fetchAllQueuesService = async (
  payload: Partial<queryInterface>
): Promise<Response> => {
  try {
    let { query, perPage, page } = payload;

    let queryValue = {} as { name: Record<string, any> };
    if (query) {
      queryValue = {
        name: {
          [Op.like]: query,
        },
      };
    }
    if (!page) {
      page = defaults.page;
    }
    if (!perPage) {
      perPage = defaults.perPage;
    }

    const queues = await Queue.findAndCountAll({
      where: {
        ...queryValue,
        isDeleted: false,
      },
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    if (queues.count === 0) return ResponseHandler.success("No queues found");

    return ResponseHandler.success("Queues fetched successfully", {
      count: queues.count,
      queues: queues.rows.map((queue) => queueSerializer(queue)),
    });
  } catch (error) {
    return AppError.internal();
  }
};

const fetchOrgQueuesService = async (
  payload: Partial<queryInterface> & { orgId: number }
): Promise<Response> => {
  try {
    console.log("in service", payload);
    let { query, perPage, page } = payload;

    let queryValue = {} as { name: Record<string, any> };
    if (query) {
      queryValue = {
        name: {
          [Op.like]: query,
        },
      };
    }
    if (!page) {
      page = defaults.page;
    }
    if (!perPage) {
      perPage = defaults.perPage;
    }

    const queues = await Queue.findAndCountAll({
      where: {
        ...queryValue,
        isDeleted: false,
        orgId: payload.orgId,
      },
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    console.log("queues", queues);

    if (queues.count === 0) return ResponseHandler.success("No queues found");

    return ResponseHandler.success("Queues fetched successfully", {
      count: queues.count,
      queues: queues.rows.map((queue) => queueSerializer(queue)),
    });
  } catch (error) {
    console.log("error", error);
    return AppError.internal();
  }
};

const updateOrgQueuesService = async (
  payload: QueueQueryInterface
): Promise<Response> => {
  try {
    console.log("payload", payload);
    const { queueId, orgId, ...restOfPayload } = payload;

    await Queue.update(restOfPayload, {
      where: {
        id: queueId,
        orgId,
        isDeleted: false,
      },
    });

    return ResponseHandler.success("Queue updated successfully");
  } catch (error) {
    console.log("error", error);
    return AppError.internal();
  }
};

export {
  createQueueService,
  fetchAllQueuesService,
  fetchOrgQueuesService,
  updateOrgQueuesService,
};
