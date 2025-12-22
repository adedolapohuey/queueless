import { queryInterface, Response } from "../interfaces/indexInterface";
import {
  QueueInterface,
  QueueQueryInterface,
  TicketInterface,
} from "../interfaces/queueInterface";
import { Organization } from "../models/organization.model";
import { AppError } from "../helpers/appError";
import { ResponseHandler } from "../helpers/responseHandler";
import {
  queueSerializer,
  ticketsSerializer,
} from "../serializers/queue.serializer";
import { Queue } from "../models/queue.model";
import { defaults } from "../helpers";
import { Op } from "sequelize";
import { User, Ticket } from "../models/association";

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

const joinQueueService = async (
  payload: Pick<TicketInterface, "queueId" | "orgId" | "userId">
): Promise<Response> => {
  try {
    const { queueId, orgId, userId } = payload;

    const queue = await Queue.findOne({
      where: {
        id: queueId,
        orgId,
        isDeleted: false,
      },
      attributes: ["id", "name", "estimatedInterval"],
    });

    if (!queue) return AppError.notFound("Queue not found");

    // check that user is not already in the queue
    const existingTicket = await Ticket.findOne({
      where: {
        queueId,
        orgId,
        userId,
        status: "pending",
      },
      attributes: ["id"],
    });

    if (existingTicket)
      return AppError.badRequest("User is already in the queue");

    // Implementation for joining a queue will go here
    const ticketNumber = await generateTicketNumber(queue.name);

    const ticket = await Ticket.create({
      ticketNumber,
      queueId: queue.id,
      userId,
      orgId,
      status: "pending",
    });

    return ResponseHandler.success(
      "Joined queue successfully",
      ticketsSerializer(ticket)
    );
  } catch (error) {
    console.log("error", error);
    return AppError.internal();
  }
};

const fetchQueueUsersService = async (
  payload: Pick<TicketInterface, "queueId" | "orgId">
): Promise<Response> => {
  try {
    const { queueId, orgId } = payload;

    const tickets = await Ticket.findAll({
      where: {
        queueId,
        orgId,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });

    console.log("tickets", tickets[0].user);

    if (tickets.length === 0)
      return ResponseHandler.success("No users in queue");

    return ResponseHandler.success(
      "Queue users fetched successfully",
      tickets.map((ticket) => ticketsSerializer(ticket))
    );
  } catch (error) {
    console.log("error", error);
    return AppError.internal();
  }
};

const generateTicketNumber = async (queueName: string): Promise<string> => {
  // structure for ticket number
  // first three letters of queue name + date + random 4 digit number
  const orgPrefix = queueName.replace(/\s+/g, "").slice(0, 3).toUpperCase();
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  const ticketNumber = `${orgPrefix}${datePart}${randomPart}`;

  // check if number exists in database
  // if exists, recursively generate a new one
  // else, return the ticket number
  const checkTicketExists = await Ticket.findOne({
    where: {
      ticketNumber,
      status: "pending",
    },
    attributes: ["id"],
  });

  if (checkTicketExists) {
    return generateTicketNumber(queueName);
  }

  return ticketNumber;
};

export {
  createQueueService,
  fetchAllQueuesService,
  fetchOrgQueuesService,
  updateOrgQueuesService,
  joinQueueService,
  fetchQueueUsersService,
};
