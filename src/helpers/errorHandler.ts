// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Normalize to AppError
  const error = err instanceof AppError ? err : new AppError(err.message, 500);

  // Log all errors (can plug into Winston, Sentry, etc.)
  console.error(`[Error] ${error.message}`);

  res.status(error.response.status).json(error.response);
};
