import { z } from "zod";
import validator from "validator";

// Custom email sanitization
export const sanitizeEmail = (email: string) =>
  validator.normalizeEmail(email) || "";

// Schema definition
export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(100, "Name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  firstName: z
    .string()
    .trim()
    .min(2, "First Name must be at least 2 characters")
    .max(100, "First Name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  lastName: z
    .string()
    .trim()
    .min(2, "Last Name must be at least 2 characters")
    .max(100, "Last Name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  organization: z
    .string()
    .trim()
    .max(100, "Organization name too long")
    .transform((val) => validator.escape(val)), // escape HTML
  password: z
    .string()
    .trim()
    .min(2, "Password must be at least 2 characters")
    .max(100, "Password too long")
    .transform((val) => validator.escape(val)), // escape HTML

  email: z
    .string()
    .email("Invalid email")
    .transform((val) => sanitizeEmail(val)),
});

export const loginUserSchema = z.object({
  username: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
  password: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
});

export const verifyUserSchema = z.object({
  username: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
  code: z
    .string()
    .trim()
    .transform((val) => validator.escape(val)), // escape HTML
});

// Type inference for TS
export type CreateUserInput = z.infer<typeof createUserSchema>;
