import { z } from "zod";
import validator from "validator";

export const createQueueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 1")
    .max(100, "Name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  orgId: z.number().min(1, "OrgId is required"),
  estimatedInterval: z.number().min(1, "estimated interval must be at least 1"),
});
