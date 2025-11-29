import { Queue } from "../models/queue.model";

export function queueSerializer(queue: Queue) {
  return {
    id: queue.id,
    name: queue.name,
    estimatedInterval: queue.estimatedInterval,
    orgId: queue.orgId,
  };
}
