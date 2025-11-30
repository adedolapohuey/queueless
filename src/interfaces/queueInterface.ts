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
