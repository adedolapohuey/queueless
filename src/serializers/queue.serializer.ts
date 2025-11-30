import { Queue } from "../models/queue.model";

export function queueSerializer(queue: Queue) {
  return {
    queueId: queue.id,
    name: queue.name,
    estimatedInterval: queue.estimatedInterval,
  };
}
