export interface QueueInterface {
  name: string;
  estimatedInterval: number;
  orgId: number;
}

export interface QueueData extends QueueInterface {
  id: number;
  isDeleted: boolean;
}

export interface QueueQueryInterface extends QueueData {
  queueId?: number;
}

export interface TicketInterface {
  ticketNumber: string;
  queueId: number;
  orgId: number;
  userId: number;
  status: "pending" | "completed" | "cancelled";
}

export interface TicketData extends TicketInterface {
  id: number;
  appointmentTime?: Date;
}
