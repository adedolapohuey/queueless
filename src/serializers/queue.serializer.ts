import { Queue } from "../models/queue.model";
import { Ticket } from "../models/ticket.model";

export function queueSerializer(queue: Queue) {
  return {
    queueId: queue.id,
    name: queue.name,
    estimatedInterval: queue.estimatedInterval,
  };
}

export function ticketsSerializer(ticket: Ticket) {
  return {
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    queueId: ticket.queueId,
    userId: ticket.userId,
    organizationId: ticket.orgId,
    status: ticket.status,
    name: ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : "",
  };
}
