import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../helpers/appError";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      const { _errors, ...mainErrors } = err.format();

      const messages: Record<string, string> = {};
      for (const key in mainErrors) {
        messages[key] = mainErrors[key]._errors.join(", ");
      }

      throw new AppError("Invalid input", 400, messages);
    }
  };
