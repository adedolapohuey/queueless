import { z } from "zod";
import validator from "validator";
import { sanitizeEmail } from "./userSchema";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  description: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
  domain: z
    .string()
    .trim()
    .min(2, "Domain must be at least 2 characters")
    .max(100, "Domain too long")
    .transform((val) => validator.escape(val)), // escape HTML
  password: z
    .string()
    .trim()
    .min(2, "Password must be at least 2 characters")
    .max(100, "Password too long")
    .transform((val) => validator.escape(val)), // escape HTML
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .transform((val) => sanitizeEmail(val)),
});

export const loginOrganizationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .transform((val) => sanitizeEmail(val)),
  password: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
});
