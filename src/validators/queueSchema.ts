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

export const querySchema = z.object({
  query: z.string().trim().optional(),
  perPage: z.number().optional(),
  userId: z.number().optional(),
  orgId: z.number().optional(),
  page: z.number().optional(),
});

export const updateQueueSchema = z.object({
  queueId: z.number().min(1, "Queue ID is required"),
  name: z.string().trim().optional(), // escape HTML
  estimatedInterval: z.number().optional(),
  orgId: z.number().min(1, "OrgId is required"),
  isDeleted: z.boolean().optional(),
});
